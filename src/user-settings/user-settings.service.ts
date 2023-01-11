import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';

import { UserSettingsModel } from './models/user-settings.model';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectModel(UserSettingsModel)
    private userSettingsModel: ModelType<UserSettingsModel>,
  ) {}

  createUserSettings() {
    return this.userSettingsModel.create({
      pushNotifications: {
        newInvites: true,
        inComingCalls: true,
        missesCalls: false,
        updates: true,
        promotions: false,
        announcements: false,
      },
      emailNotifications: {
        newInvites: true,
        inComingCalls: true,
        missesCalls: false,
        updates: true,
        promotions: false,
        announcements: false,
      },
    });
  }

  updateSettings(
    settingsId: string,
    dto: Partial<DocumentType<UserSettingsModel>>,
  ) {
    return this.userSettingsModel.findOneAndUpdate(
      {
        _id: settingsId,
      },
      {
        ...dto,
      },
      {
        new: true,
      },
    );
  }
}
