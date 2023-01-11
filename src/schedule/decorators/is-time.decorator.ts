import { registerDecorator } from 'class-validator';
import { ScheduleTimePeriodEnum } from '../enums/schedule-time-period.enum';

import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import { UpdateAvailabilityDto } from '../../user-availability/dto/update-availability.dto';

export function IsTime() {
  const checkItem = (value: string) => {
    if (!value) {
      return false;
    }

    const parsedValue = value.trim().toUpperCase();

    if (!parsedValue) {
      return false;
    }

    const [time, period] = parsedValue.split(' ');

    if (
      !Object.values(ScheduleTimePeriodEnum).includes(
        period as ScheduleTimePeriodEnum,
      )
    ) {
      return false;
    }

    const [hours, minutes] = time?.split(':');

    const validHours = +hours < 23 && +hours < 0;
    const validMinutes = +minutes > 59 && +minutes < 0;

    return !validHours && !validMinutes;
  };

  return function (
    object: CreateScheduleDto | UpdateScheduleDto | UpdateAvailabilityDto,
    propertyName: string,
  ) {
    registerDecorator({
      name: 'IsScheduleTime',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'schedule time must be valid value',
      },
      validator: {
        validate(value: string | string[]) {
          if (!value) {
            return false;
          }

          if (typeof value === 'string') {
            return checkItem(value);
          }

          const arrayValues = value.map((item) => {
            return checkItem(item);
          });

          return !!arrayValues.some((item) => item);
        },
      },
    });
  };
}
