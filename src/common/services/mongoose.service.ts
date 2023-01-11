import { Injectable } from '@nestjs/common';
import { SortOrderEnum } from '../enums/sort-order.enum';

@Injectable()
export class MongooseService {
  getOrder(sortOrder?: SortOrderEnum) {
    if (!sortOrder) {
      return -1;
    }

    return sortOrder === SortOrderEnum.ASC ? 1 : -1;
  }
}
