import { ScheduleService } from './schedule.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { UserOtpService } from '../user-otp/user-otp.service';
import { UserAvailabilityService } from '../user-availability/user-availability.service';
import { BcryptService } from '../common/services/bcrypt.service';
import { UserSettingsService } from '../user-settings/user-settings.service';

export const scheduleProviders = [
  ScheduleService,
  UserService,
  AuthService,
  BcryptService,
  UserOtpService,
  UserSettingsService,
  UserAvailabilityService,
];
