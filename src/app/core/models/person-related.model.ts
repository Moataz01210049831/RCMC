export interface PersonRelatedRequest {
  IdentifierTypeID: number;
  IdentifierNo: string;
}

export interface RelationType {
  RelationTypeID: number;
  RelationTypeDescAr: string;
  RelationTypeDescEn: string;
}

export interface EntityType {
  EntityTypeID: number;
  EntityTypeDescAr: string;
  EntityTypeDescEn: string;
}

export interface CompanyForm {
  CompanyFormID: number;
  CompanyFormDescriptionAr: string;
  CompanyFormDescriptionEn: string;
}

export interface CrStatus {
  CrStatusID: number;
  CrStatusDescAr: string;
  CrStatusDescEn: string;
}

export interface CrBasicInfo {
  IsMain: boolean;
  CrNationalNumber: string;
  CrNumber: string;
  EntityFullNameAr: string;
  EntityFullNameEn: string;
  EntityType: EntityType;
  CompanyForm: CompanyForm;
  CrStatus: CrStatus;
}

export interface RelatedCR {
  RelationTypeList: RelationType[];
  CrBasicInfo: CrBasicInfo;
}

export interface IdentifierType {
  IdentifierTypeID: number;
  IdentifierTypeDescAr: string;
  IdentifierTypeDescEn: string;
}

export interface PersonRelatedResponse {
  ParityNameAr: string;
  ParityNameEn: string;
  IdentifierNo: string;
  IdentifierType: IdentifierType;
  RelatedCRList: RelatedCR[];
  Metadata: { Count: number };
}
