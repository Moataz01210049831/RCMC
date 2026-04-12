export interface CreateContactRequest {
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
