export interface CreateContactRequest {
  firstName: string;
  middleName: string;
  thirdName: string;
  lastName: string;
  cityId: string;
  dateOfBirth: string;
  email: string;
  genderId: number;
  identityTypeId: number;
  identityNumber: string;
  mobileNumber: string;
  mobileNumber2: string;
  nationalityId: string;
  preferredContactMethod: number;
  preferredLanguage: number;
  regionId: string;
}

export interface ContactResponse {
  id: string;
  firstName: string;
  middleName: string;
  thirdName: string;
  lastName: string;
  cityId: string;
  dateOfBirth: string;
  email: string;
  gender: number;
  identityType: number;
  identityNumber: string;
  mobileNumber1: string;
  mobileNumber2: string;
  nationalityId: string;
  preferredContactMethod: number;
  preferredLanguage: number;
  regionId: string;
  CreatedOn: string;
}

export interface UpdateContactRequest extends CreateContactRequest {
  EntityId: string;
}

export interface UpdateContactResponse {
  success: boolean;
  message: string;
  data: unknown;
  errors: unknown;
}

export interface SearchContactsRequest {
  identityNumber?: string;
  name?: string;
  mobileNumber?: string;
  pageNumber: number;
  pageSize: number;
}

export interface SearchContactsResponse {
  items: ContactResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface BasicInfoRequest {
  personID: number;
  birthDate: number;
  operatorID: number;
  clientIPAddress: string;
  lang: string;
}

export interface BasicInfoResponse {
  FirstName: string | null;
  Middlename: string | null;
  ThirdName: string | null;
  LastName: string | null;
  FamilyName: string | null;
  CityId: string | null;
  Email: string | null;
  Birthdate: string | null;
  GenderId: number | null;
  IdentityTypeId: number | null;
  IdentityNumber: string | null;
  NationalityId: string | null;
  Nationality: string | null;
  PreferredContactMethod: number | null;
  PreferredLanguage: number | null;
  MobileNumber: string | null;
  MobileNumber2: string | null;
  RegionId: string | null;
  CityName: string | null;
  RegionName: string | null;
  EntityId: string | null;
  FullName: string | null;
}
