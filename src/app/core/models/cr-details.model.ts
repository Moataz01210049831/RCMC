export interface CrDetailsRequest {
  CRNationalNumber: string;
  CRNumber: string;
}

export interface CrStatus {
  CrStatusID: number;
  CrStatusDescAr: string;
  CrStatusDescEn: string;
}

export interface CrInformation {
  CrNationalNumber: string;
  CrNumber: string;
  EntityFullNameAr: string;
  EntityFullNameEn: string;
  Capital: number;
  IsMain: boolean;
  HasEcommerce: boolean;
  CrStatus: CrStatus;
}

export interface CrContactInformation {
  PhoneNo: string;
  MobileNo: string;
  Email: string;
  WebsiteURL: string;
}

export interface CrActivity {
  ActivityID: string;
  ActivityDescriptionAr: string;
  ActivityDescriptionEn: string;
}

export interface CrActivities {
  ActivitiesType: string;
  ActivityList: CrActivity[];
}

export interface CrDetailsResponse {
  CrInformation: CrInformation;
  ContactInformation: CrContactInformation;
  CrActivities: CrActivities;
}
