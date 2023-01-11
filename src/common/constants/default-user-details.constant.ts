import { UserDetailModel } from '../../user/models/user-detail.model';

export const defaultDetailsLabels = [
  'Pronouns',
  'Sexuality',
  'Ethnicity',
  'Children',
  'Family Plans',
  'Work',
  'Job Title',
  'School',
  'Education Level',
  'Religious Beliefs',
  'Religious Beliefs',
  'Politics',
  'Pets',
  'Language',
  'Drinking',
  'Smoking',
  'Marijuana',
  'Drugs',
];

export const defaultUserDetails: UserDetailModel[] = defaultDetailsLabels.map(
  (item) => {
    return {
      label: item,
      value: '',
    };
  },
);
