import { ScheduleService } from '../schedule/schedule.service';
import { UserService } from '../user/user.service';
import { UserOtpService } from '../user-otp/user-otp.service';
import { AuthService } from '../auth/auth.service';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { UserAvailabilityService } from '../user-availability/user-availability.service';
import { CallService } from './call.service';

export const callProviders = [
  CallService,
  ScheduleService,
  UserService,
  UserOtpService,
  AuthService,
  UserSettingsService,
  UserAvailabilityService,
];
