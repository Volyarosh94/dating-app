import {
  ModelOptions,
  mongoose,
  prop,
  Severity,
  DocumentType,
} from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

import { UserStatusEnum } from '../enums/user-status.enum';
import { UserInfo } from './user-info.model';
import { UserLocation } from './user-location.model';
import { UserDetailModel } from './user-detail.model';
import { defaultUserDetails } from '../../common/constants/default-user-details.constant';
import { UserSettingsModel } from '../../user-settings/models/user-settings.model';
import { UserSocialMediaTokenModel } from './user-social-media-token.model';
import { defaultUserSocialMediaTokens } from '../../common/constants/default-user-social-media-tokens.constant';
import { DatabaseTablesEnum } from '../../common/enums/database-tables.enum';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: DatabaseTablesEnum.USER,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class UserModel {
  @prop({
    type: String,
    required: true,
  })
  @ApiProperty()
  phoneNumber: string;

  @prop({
    type: String,
    required: false,
    default: '',
  })
  @ApiProperty({
    required: false,
  })
  email: string;

  @prop({
    type: UserSettingsModel,
    ref: UserSettingsModel,
    autopopulate: true,
    required: true,
  })
  @ApiProperty({
    type: UserSettingsModel,
  })
  settings: DocumentType<UserSettingsModel>;

  @prop({
    enum: UserStatusEnum,
    required: true,
    default: UserStatusEnum.PENDING,
  })
  @ApiProperty()
  status: UserStatusEnum = UserStatusEnum.PENDING;

  @prop({
    type: String,
    required: false,
    select: false,
  })
  password: string;

  @prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
  })
  @ApiProperty({
    type: UserInfo,
  })
  info: UserInfo;

  @prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
  })
  @ApiProperty({
    type: UserLocation,
  })
  location: UserLocation;

  @prop({
    type: Boolean,
    required: true,
    default: false,
  })
  @ApiProperty()
  online: boolean;

  @prop({
    type: [UserDetailModel],
    required: true,
    default: defaultUserDetails,
  })
  @ApiProperty({
    type: [UserDetailModel],
  })
  details: UserDetailModel[];

  @prop({
    type: [UserSocialMediaTokenModel],
    required: true,
    default: defaultUserSocialMediaTokens,
  })
  @ApiProperty({
    type: [UserSocialMediaTokenModel],
  })
  socialMediaTokens: UserSocialMediaTokenModel[];
}
