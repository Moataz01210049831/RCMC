export interface AddInquiryForm {
  entityId:             string | null;
  mainClassificationId: string | null;
  subClassificationId:  string | null;
  inquiryTypeId:        string | null;
  submitterTypeId:      string | null;
  details:              string;
  response:             string;
  notes:                string;
  attachments:          File[];
}
