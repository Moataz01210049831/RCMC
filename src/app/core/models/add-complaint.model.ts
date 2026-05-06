import { ComplaintRequirement } from './complaint-requirement.model';

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

export interface ComplaintAttachment {
  fileName: string;
  base64:   string;
  mimeType: string;
}

export interface AddComplaintPayload {
  description:               string;
  contactId:                 string;
  serviceProviderId:         string;
  mainServiceId:             string;
  subServiceId:              string;
  complaintCategoryId:       string;
  complaintMainCategoryId:   string;
  complaintSubCategoryId:    string;
  regionId:                  string;
  commercialRecord:          string;
  questionId:                string[];
  complainQuestions:         Record<string, string | string[]>;
  relatedTicketIds:          string[];
  isAttached:                boolean;
  attachments:               ComplaintAttachment[];
}
