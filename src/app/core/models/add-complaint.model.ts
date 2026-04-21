import { ComplaintRequirement } from './complaint-requirement.model';

export interface AddComplaintForm {
  serviceProviderId:    string | null;
  mainServiceId:        string | null;
  subServiceId:         string | null;
  mainClassificationId: string | null;
  subClassificationId:  string | null;
  complaintCategory:    string;
  regionId:             string | null;
  requirements:         ComplaintRequirement[];
  relatedTickets:       string[];
  description:          string;
  attachments:          File[];
}
