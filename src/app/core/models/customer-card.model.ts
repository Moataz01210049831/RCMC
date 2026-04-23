export interface CustomerCardData {
  id: string;
  fullName: string;
  idNumber: string;
  phone: string;
  birthDate: string;
  nationality: string;
  gender: string;
  city: string;
  status?: string;
  CreatedOn?: string;
  createdBy?: string;
  updatedAt?: string;
}

export interface EntityCardData {
  companyName: string;
  entityType: string;
  crNumber: string;
  unifiedNumber: string;
  phone: string;
}
