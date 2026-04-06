import type { ContactResponse } from '../models/contact.model';

export const DUMMY_CONTACT: ContactResponse = {
  id:                     'dummy-id',
  firstName:              'حسن',
  middleName:             'حمدان',
  thirdName:              'محمد',
  lastName:               'جاد',
  cityId:                 'city-05',
  dateOfBirth:            '1990-05-15T00:00:00',
  email:                  'hassan.gad@example.com',
  gender:                 1,
  identityType:           1,
  identityNumber:         '1234567890',
  mobileNumber1:          '0501234567',
  mobileNumber2:          '0507654321',
  nationalityId:          'country-01',
  preferredContactMethod: 1,
  preferredLanguage:      0,
  regionId:               'region-04',
};
