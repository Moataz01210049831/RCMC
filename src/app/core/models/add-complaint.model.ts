import { ComplaintRequirement } from './complaint-requirement.model';
import { IdentifierType, RelatedCR } from './person-related.model';

export interface AddComplaintForm {
  serviceProviderId:    string | null;
  mainServiceId:        string | null;
  subServiceId:         string | null;
  mainClassificationId: string | null;
  subClassificationId:  string | null;
  complaintCategory:    string | null;
  complaintCategoryId:  string | null;
  regionId:             string | null;
  requirements:         ComplaintRequirement[];
  relatedTickets:       string[];
  description:          string;
  attachments:          File[];
}

export interface RelatedContext {
  parityNameAr:      string;
  parityNameEn:      string;
  identifierNo:      string;
  identifierType:    IdentifierType | null;
  selectedRelatedCR: RelatedCR | null;
}

export interface AddComplaintPayload {
  serviceProviderId:           string;
  mainServiceId:               string;
  subServiceId:                string;
  title:                       string;
  complaintCategoryId:         string;
  complaintMainCategoryId:     string;
  complaintSubCategoryId:      string;
  complaintSubCategoryClassId: string;
  regionId:                    string;
  entityTypeId:                string;
  commercialRecordId:          string;
  customerId:                  string;
  description:                 string;
  agentQuestionnaire:          string;
  complainQuestions:           Record<string, string | string[]>;
  attachmentFullfield:         boolean;
}

export interface AddComplaintSubmission {
  payload:         AddComplaintPayload;
  attachments:     File[];
  fileDescription: string;
  isDraft:         boolean;
}
