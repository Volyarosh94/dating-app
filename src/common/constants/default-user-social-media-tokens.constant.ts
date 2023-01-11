import { UserSocialMediaTokenModel } from '../../user/models/user-social-media-token.model';

export const defaultUserSocialMediasNetworks = [
  'Apple',
  'Facebook',
  'Instagram',
  'Linkedin',
];

export const defaultUserSocialMediaTokens: UserSocialMediaTokenModel[] =
  defaultUserSocialMediasNetworks.map((socialMedia) => {
    return {
      socialMedia,
      token: '',
    };
  });
