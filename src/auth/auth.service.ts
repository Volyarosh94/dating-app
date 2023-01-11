import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { SignUpDto } from './dto/sign-up.dto';
import { UserModel } from '../user/models/user.model';
import { ErrorMessagesEnum } from '../common/enums/error-messages.enum';
import { LoginDto } from './dto/login.dto';
import { BcryptService } from '../common/services/bcrypt.service';
import { UserOtpService } from '../user-otp/user-otp.service';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { AuthTokenModel } from './models/authToken.model';
import { UserAvailabilityService } from '../user-availability/user-availability.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private userModel: ModelType<UserModel>,
    @InjectModel(AuthTokenModel)
    private authTokenModel: ModelType<AuthTokenModel>,
    @Inject(forwardRef(() => UserOtpService))
    private userOtpService: UserOtpService,
    private bcryptService: BcryptService,
    private userSettingsService: UserSettingsService,
    private userAvailabilityService: UserAvailabilityService,
  ) {}

  async signUp(dto: SignUpDto) {
    const userExists = await this.userModel.findOne({
      $or: [
        {
          phoneNumber: dto.phoneNumber,
        },
        ...(dto.email
          ? [
              {
                email: dto.email,
              },
            ]
          : []),
      ],
    });

    if (userExists) {
      throw new ConflictException(ErrorMessagesEnum.USER.CREDENTIAL_EXISTS);
    }

    const userSettings = await this.userSettingsService.createUserSettings();

    const user = await this.userModel.create({
      ...dto,
      info: {
        firstName: '',
        lastName: '',
        height: '',
        age: null,
      },
      location: {
        lat: '',
        lng: '',
        city: '',
      },
      settings: userSettings._id,
    });

    await this.userAvailabilityService.createDefaultAvailability(user._id);

    await this.userOtpService.createAndSendUserOtp(user._id, dto.phoneNumber);

    return {
      message: ErrorMessagesEnum.AUTH.OTP_SENT,
    };
  }

  async login(dto: LoginDto) {
    const { phoneNumber } = dto;

    const user = await this.userModel
      .findOne({
        phoneNumber,
      })
      .select('+password');

    if (!user) {
      throw new BadRequestException(ErrorMessagesEnum.AUTH.INVALID_CREDENTIALS);
    }

    await this.userOtpService.createAndSendUserOtp(user._id, dto.phoneNumber);

    return {
      message: ErrorMessagesEnum.AUTH.OTP_SENT,
    };
  }

  async logout(authTokenId: string) {
    await this.authTokenModel.findOneAndDelete({
      _id: authTokenId,
    });

    return {
      success: true,
    };
  }

  async deleteUserAuthTokens(userId: string) {
    await this.authTokenModel.deleteMany({
      user: userId,
    });

    return { success: true };
  }
}
