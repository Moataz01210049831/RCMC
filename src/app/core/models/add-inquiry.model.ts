import { KbArticle } from './kb-article.model';

export interface AddInquiryForm {
  entityId:             string | null;
  mainClassificationId: string | null;
  subClassificationId:  string | null;
  inquiryTypeId:        string | null;
  submitterTypeId:      string | null;
  details:              string;
  isInquiryAnswered:    boolean | null;
  selectedArticles:     KbArticle[];
  notes:                string;
}

export interface AddInquiryPayload {
  InquiryType:              string;
  InteractionId:            string;
  ContactId:                string;
  Description:              string;
  DependentName:            string;
  TicketTypeId:             string;
  TicketNumber:             string;
  Title:                    string;
  Category:                 string;
  SubCategory:              string;
  ContactSourceId:          string;
  CityId:                   string;
  EntityId:                 string;
  IsInquiryAnswered:        boolean;
  ArticleIds:               string[];
  UserId:                   string;
  InquiryQuestions:         Record<string, unknown>;
  QuestionId:               string[];
  DocumentInquiryNumber:    string;
  DocumentInquiryType:      string;
  DocumentInquiryResponse:  string;
}
