export interface PersonRelatedRequest {
  IdentifierTypeID: number;
  IdentifierNo: string;
  NationalityID: number;
  Limit: number;
  Offset: number;
}

export interface RelatedCR {
  CrNationalNumber: string;
  CrNumber: string;
  EntityFullNameAr: string;
  EntityFullNameEn: string;
  RelationType: string;
}

export interface PersonRelatedResponse {
  ParityNameAr: string;
  ParityNameEn: string;
  RelatedCRList: RelatedCR[];
  Metadata: {
    Count: number;
    Limit: number;
    Offset: number;
  };
}
