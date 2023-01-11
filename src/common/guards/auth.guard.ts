import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { ErrorMessagesEnum } from '../enums/error-messages.enum';
import { AuthTokenModel } from '../../auth/models/authToken.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(AuthTokenModel)
    private authTokenModel: ModelType<AuthTokenModel>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException(ErrorMessagesEnum.AUTH.TOKEN_NOT_FOUND);
    }

    const token = authorization.split(' ')[1];

    const authToken = await this.authTokenModel
      .findOne({
        token,
      })
      .populate({
        path: 'user',
        populate: {
          path: 'settings',
        },
      });

    if (!authToken || !authToken.user) {
      throw new UnauthorizedException(ErrorMessagesEnum.AUTH.INVALID_TOKEN);
    }

    req.headers.user = Object.assign(authToken.user, {
      authTokenId: authToken._id,
    });

    return true;
  }
}
