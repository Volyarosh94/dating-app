import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  calculateDiff(firstDate: Date | string, secondDate: Date | string) {
    const firstTime = new Date(firstDate).getTime();
    const secondTime = new Date(secondDate).getTime();

    const difference = firstTime - secondTime;

    return {
      minutes: Math.round(difference / 60000),
    };
  }
}
