import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

import { UserOtpModel } from './models/user-otp.model';
import { RandomService } from '../common/services/random.service';
import { TwilioService } from '../common/services/twilio.service';
import { ErrorMessagesEnum } from '../common/enums/error-messages.enum';
import { DateService } from '../common/services/date.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '../common/services/jwt.service';

@Injectable()
export class UserOtpService {
  constructor(
    @InjectModel(UserOtpModel) private userOtpModel: ModelType<UserOtpModel>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private randomService: RandomService,
    private twilioService: TwilioService,
    private dateService: DateService,
    private jwtService: JwtService,
  ) {}

  async createAndSendUserOtp(userId: string, phoneNumber: string) {
    const otpNumber = this.randomService.generateRandomNumber(6);

    await this.userOtpModel.create({
      userId,
      otp: otpNumber,
    });

    return this.twilioService.sendSms(`Otp code: ${otpNumber}`, phoneNumber);
  }

  async validateUserOtp(userId: string, otp: number) {
    const userOtp: DocumentType<UserOtpModel & TimeStamps> =
      await this.userOtpModel.findOne({
        userId,
        otp,
      });

    if (!userOtp) {
      throw new BadRequestException(ErrorMessagesEnum.OTP.INVALID_OTP);
    }

    const { minutes } = this.dateService.calculateDiff(
      userOtp.createdAt,
      new Date(),
    );

    if (minutes > 5) {
      await this.userOtpModel.findOneAndDelete({
        _id: userOtp._id,
      });

      throw new BadRequestException(ErrorMessagesEnum.OTP.OTP_EXPIRED);
    }

    await this.userOtpModel.findOneAndDelete({
      _id: userOtp._id,
    });
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { otp, phoneNumber } = dto;

    const user = await this.userService.getUserByParams({
      phoneNumber,
    });

    if (!user) {
      throw new NotFoundException(ErrorMessagesEnum.USER.NOT_FOUND);
    }

    await this.validateUserOtp(user._id, otp);

    return this.jwtService.generateAuthToken(user._id);
  }
}
