export interface RelatedTicket {
  IncidentId:        string;
  TicketNumber:      string;
  CaseCurrentStatus?: string | null;
  CreatedOn?:        string | null;
}

export interface ComplainSearchRequest {
  ContactId:    string;
  TicketNumber: string;
  Status:       string;
  FromDate:     string;
  ToDate:       string;
  PageNumber:   number;
  PageSize:     number;
  OrderBy:      number;
}

export interface ComplainSearchResult {
  data:       RelatedTicket[];
  totalCount: number;
}
