import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import * as Twilio from 'twilio';

import { TwilioEnum } from '../enums/twilio.enum';
import { TokenInstance } from 'twilio/lib/rest/api/v2010/account/token';

const { AccessToken } = Twilio.jwt;
const VideoGrant = AccessToken.VideoGrant;

@Injectable()
export class TwilioService {
  constructor(@InjectTwilio() private readonly client: TwilioClient) {}

  sendSms(body: string, phoneNumber: string) {
    try {
      return this.client.messages.create({
        body,
        to: phoneNumber,
        messagingServiceSid: 'MGb9df796cbb64fa360ef24e219bcdf5ca',
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getToken(identity: string) {
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_SECRET_KEY,
    );

    token.identity = identity;

    const videoGrant = new VideoGrant();

    token.addGrant(videoGrant);

    return token.toJwt();
  }

  async createVideoCall(uniqueName: string, identity: string) {
    const twilioToken = await this.getToken(identity);

    return {
      token: twilioToken,
      identity,
    };
  }
}
