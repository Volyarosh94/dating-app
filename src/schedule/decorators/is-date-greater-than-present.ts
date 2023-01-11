import { registerDecorator } from 'class-validator';

import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { UpdateAvailabilityDto } from '../../user-availability/dto/update-availability.dto';

export function IsDateGreaterThanPresent() {
  return function (
    object: CreateScheduleDto | UpdateScheduleDto | UpdateAvailabilityDto,
    propertyName: string,
  ) {
    registerDecorator({
      name: 'IsDateGreaterThanPresent',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'date must be greater than present date',
      },
      validator: {
        validate(value: string) {
          if (!value) {
            return false;
          }

          return new Date() < new Date(value);
        },
      },
    });
  };
}
