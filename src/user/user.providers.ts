import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { UserAvailabilityService } from '../user-availability/user-availability.service';

export const userProviders = [
  UserService,
  AuthService,
  UserSettingsService,
  UserAvailabilityService,
];
