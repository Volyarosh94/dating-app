import { AuthService } from './auth.service';
import { UserOtpService } from '../user-otp/user-otp.service';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { UserAvailabilityService } from '../user-availability/user-availability.service';
import { UserService } from '../user/user.service';

export const authProviders = [
  UserOtpService,
  UserSettingsService,
  AuthService,
  UserService,
  UserAvailabilityService,
];
