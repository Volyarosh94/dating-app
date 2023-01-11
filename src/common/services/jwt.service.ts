import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { sign, verify } from 'jsonwebtoken';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { AuthTokenModel } from '../../auth/models/authToken.model';
import { ErrorMessagesEnum } from '../enums/error-messages.enum';

@Injectable()
export class JwtService {
  constructor(
    @InjectModel(AuthTokenModel)
    private authTokenModel: ModelType<AuthTokenModel>,
  ) {}

  async generateAuthToken(userId: string) {
    const token = sign({}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    return this.authTokenModel.create({
      token,
      user: userId,
    });
  }

  async validateToken(token: string) {
    try {
      await verify(token, process.env.JWT_SECRET);

      const authToken = await this.authTokenModel.findOne({
        where: {
          token,
        },
      });

      if (!authToken) {
        throw new UnauthorizedException(ErrorMessagesEnum.AUTH.INVALID_TOKEN);
      }

      return authToken;
    } catch (e) {
      throw new UnauthorizedException(ErrorMessagesEnum.AUTH.INVALID_TOKEN);
    }
  }
}
