import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { mongoose } from '@typegoose/typegoose';

import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { UserModel } from './models/user.model';
import { ErrorMessagesEnum } from '../common/enums/error-messages.enum';
import { UpdateUserLocationDto } from './dto/update-user-location.dto';
import { S3Service } from '../common/services/s3.service';
import { UploadFilePathEnum } from '../common/enums/upload-file-path.enum';
import { UserStatusEnum } from './enums/user-status.enum';
import { GetAllUsersQueryDto } from './dto/get-all-users-query.dto';
import { MongooseService } from '../common/services/mongoose.service';
import {
  calculateLocationDistance,
  convertKmToMiles,
} from '../common/helpers/location.helper';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { IUserOverview } from './interfaces/user-overview.interface';
import { UserOtpService } from '../user-otp/user-otp.service';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { AuthService } from '../auth/auth.service';
import { UpdateUserSocialMediaDto } from './dto/update-user-social-media.dto';
import { JwtService } from '../common/services/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private userModel: ModelType<UserModel>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => UserOtpService))
    private userOtpService: UserOtpService,
    private s3Service: S3Service,
    private mongooseService: MongooseService,
    private jwtService: JwtService,
  ) {}

  getUserByParams(query: mongoose.FilterQuery<DocumentType<UserModel>>) {
    return this.userModel.findOne(query);
  }

  async getUserByIdOrFail(id: string): Promise<DocumentType<UserModel>> {
    const user = await this.userModel.findOne({
      _id: id,
    });

    if (!user) {
      throw new NotFoundException(ErrorMessagesEnum.USER.NOT_FOUND);
    }

    return user;
  }

  async updateUser(
    userId: string,
    dto: mongoose.UpdateQuery<DocumentType<UserModel>>,
  ) {
    return this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        ...dto,
      },
      {
        new: true,
      },
    );
  }

  async updateUserInfo(userId: string, dto: UpdateUserInfoDto) {
    const { phoneNumber, email, ...newInfo } = dto;
    const { info } = await this.getUserByIdOrFail(userId);

    const personalInfo: Partial<DocumentType<UserModel>> = {};

    if (phoneNumber) {
      const userExists = await this.getUserByParams({
        phoneNumber,
      });

      if (userExists?._id?.toString() !== userId.toString()) {
        throw new ConflictException(ErrorMessagesEnum.USER.CREDENTIAL_EXISTS);
      }

      personalInfo.phoneNumber = phoneNumber;
    }

    if (email) {
      const userExists = await this.getUserByParams({
        email,
      });

      if (userExists?.id?.toString() !== userId.toString()) {
        throw new ConflictException(ErrorMessagesEnum.USER.CREDENTIAL_EXISTS);
      }

      personalInfo.email = email;
    }

    return this.updateUser(userId, {
      info: {
        ...info,
        ...newInfo,
      },
      ...personalInfo,
    });
  }

  async updateUserLocation(userId: string, dto: UpdateUserLocationDto) {
    const { location } = await this.getUserByIdOrFail(userId);

    return this.updateUser(userId, {
      location: {
        ...location,
        ...dto,
      },
    });
  }

  async uploadMainPhoto(userId: string, photo: Express.Multer.File) {
    const { info } = await this.getUserByIdOrFail(userId);

    const uploadedPhoto = await this.s3Service.uploadFile(
      photo,
      UploadFilePathEnum.PHOTOS,
    );

    return this.updateUser(userId, {
      info: {
        ...info,
        mainPhoto: uploadedPhoto.Location,
      },
    });
  }

  async uploadSecondaryPhoto(userId: string, photo: Express.Multer.File) {
    const { info } = await this.getUserByIdOrFail(userId);

    const uploadedPhoto = await this.s3Service.uploadFile(
      photo,
      UploadFilePathEnum.PHOTOS,
    );

    return this.updateUser(userId, {
      info: {
        ...info,
        secondaryPhoto: uploadedPhoto.Location,
      },
    });
  }

  async getAvailableUsers(userId: string, dto: GetAllUsersQueryDto) {
    const { location } = await this.getUserByIdOrFail(userId);

    const { online, status, name, sortBy = [], sortOrder, radius } = dto;

    const usersFilter: mongoose.FilterQuery<DocumentType<UserModel>> = {};
    const usersSorting = [];
    const usersOrder = this.mongooseService.getOrder(sortOrder);

    sortBy.forEach((item) => {
      usersSorting[item] = usersOrder;
    });

    if (online) {
      usersFilter.online = online;
    }

    if (status) {
      usersFilter.status = status;
    }

    if (name) {
      usersFilter.$or = [
        {
          'info.firstName': {
            $regex: name,
            $options: 'i',
          },
        },
        {
          'info.lastName': {
            $regex: name,
            $options: 'i',
          },
        },
      ];
    }

    const users = await this.userModel
      .find({
        _id: {
          $ne: userId,
        },
        status: {
          $ne: UserStatusEnum.PENDING,
        },
        ...usersFilter,
      })
      .sort(usersSorting);

    if (!radius) {
      return users;
    }

    const usersByLocation = [];

    users.forEach((user) => {
      if (!location.lng || !location.lat) {
        usersByLocation.push(user);
      }

      if (!user.location.lng || !user.location.lng) {
        return;
      }

      const kmRadius = calculateLocationDistance(
        +location.lat,
        +location.lng,
        +user.location.lat,
        +user.location.lng,
      );

      if (kmRadius <= radius) {
        usersByLocation.push(user);
      }
    });

    return usersByLocation;
  }

  async switchUserStatus(userId: string, previousStatus: boolean) {
    await this.updateUser(userId, {
      online: !previousStatus,
    });

    return {
      success: true,
    };
  }

  async confirmUser(dto: ConfirmUserDto) {
    const { otp, phoneNumber } = dto;

    const user = await this.getUserByParams({
      phoneNumber,
    });

    if (!user) {
      throw new NotFoundException(ErrorMessagesEnum.USER.NOT_FOUND);
    }

    await this.userOtpService.validateUserOtp(user._id, otp);

    await this.updateUser(user._id, {
      status: UserStatusEnum.CONFIRMED,
    });

    return this.jwtService.generateAuthToken(user._id);
  }

  async getUserOverview(
    userId: string,
    lat: number,
    lng: number,
  ): Promise<IUserOverview> {
    const user = await this.getUserByIdOrFail(userId);

    const kmDistance = calculateLocationDistance(
      +user.location.lat,
      +user.location.lng,
      lat,
      lng,
    );

    const miles = convertKmToMiles(kmDistance);

    return {
      firstName: user.info.firstName,
      lastName: user.info.lastName,
      age: user.info.age,
      height: user.info.height,
      city: user.location.city,
      distance: miles,
    };
  }

  async updateUserDetail(userId: string, dto: UpdateUserDetailDto) {
    const { value, label } = dto;

    await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        details: {
          $elemMatch: {
            label,
          },
        },
      },
      {
        $set: {
          'details.$.value': value,
        },
      },
    );

    return {
      success: true,
    };
  }

  async deleteUserAccount(userId: string) {
    await this.authService.deleteUserAuthTokens(userId);

    await this.userModel.findOneAndDelete({
      _id: userId,
    });

    return {
      success: true,
    };
  }

  async updateUserSocialMedia(userId: string, dto: UpdateUserSocialMediaDto) {
    const { socialNetwork, token } = dto;

    await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        socialMediaTokens: {
          $elemMatch: {
            socialMedia: socialNetwork,
          },
        },
      },
      {
        $set: {
          'socialMediaTokens.$.token': token,
        },
      },
    );

    return {
      success: true,
    };
  }
}
