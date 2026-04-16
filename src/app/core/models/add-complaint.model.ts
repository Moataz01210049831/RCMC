export interface AddComplaintForm {
  serviceProviderId:    string | null;
  mainServiceId:        string | null;
  subServiceId:         string | null;
  mainClassificationId: string | null;
  subClassificationId:  string | null;
  complaintCategory:    string;
  regionId:             string | null;
  textContent:          string;
  date:                 string;
  keyAddress:           boolean;
  classificationAttachments: File[];
  relatedTickets:       string[];
  description:          string;
  attachments:          File[];
}
