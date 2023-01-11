import { Module, Global } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { AuthTokenModel } from '../auth/models/authToken.model';
import { JwtService } from './services/jwt.service';
import { BcryptService } from './services/bcrypt.service';
import { AuthGuard } from './guards/auth.guard';
import { S3Service } from './services/s3.service';
import { MongooseService } from './services/mongoose.service';
import { TwilioService } from './services/twilio.service';
import { RandomService } from './services/random.service';
import { DateService } from './services/date.service';

@Global()
@Module({
  imports: [TypegooseModule.forFeature([AuthTokenModel])],
  providers: [
    JwtService,
    BcryptService,
    S3Service,
    MongooseService,
    TwilioService,
    RandomService,
    DateService,
    AuthGuard,
  ],
  exports: [
    JwtService,
    BcryptService,
    MongooseService,
    TwilioService,
    S3Service,
    RandomService,
    DateService,
    AuthGuard,
  ],
})
export class CommonModule {}
