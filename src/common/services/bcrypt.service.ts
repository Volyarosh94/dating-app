import { Injectable } from '@nestjs/common';
import { compare, hash, hashSync } from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly SALT = 10;

  hashData(data: any) {
    return hash(data, this.SALT);
  }

  hashDataSync(data: any) {
    return hashSync(data, this.SALT);
  }

  compareData(data: any, hash: string) {
    return compare(data, hash);
  }
}
