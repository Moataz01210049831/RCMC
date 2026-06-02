import { ComplainDetailsData } from '../models/complain-details.model';
import { ComplainQA, TicketDetail } from '../../features/customers/customer-tickets/tickets-layout/tickets.types';

const fmtDate = (s: string | null | undefined): string => {
  if (!s) return '-';
  return s.replace('T', ' ').slice(0, 19);
};

function mapComplainQuestions(q: Record<string, string | string[]> | null | undefined): ComplainQA[] {
  if (!q) return [];
  return Object.entries(q).map(([question, value]): ComplainQA => {
    if (!Array.isArray(value)) {
      const raw = String(value ?? '').trim().toLowerCase();
      if (raw === 'true')  return { question, answer: '', answerKey: 'COMMON.YES' };
      if (raw === 'false') return { question, answer: '', answerKey: 'COMMON.NO'  };
    }
    const answer = Array.isArray(value)
      ? value.map(v => String(v).trim()).filter(Boolean).join('، ')
      : String(value ?? '').trim();
    return { question, answer: answer || '-' };
  });
}

export function buildTicketDetail(d: ComplainDetailsData, code?: string): TicketDetail {
  const relatedNumbers = (d.RelatedTickets ?? []).map(t => t.TicketNumber);
  return {
    code:               code ?? d.TicketNumber ?? '',
    statusKey:          d.CaseCurrentStatus || '-',
    commercialEntity:   d.CommercialRecordName ?? '-',
    entityType:         d.EntityTypeName ?? '-',
    entityId:           relatedNumbers.length ? relatedNumbers.join('، ') : '-',
    serviceProvider:    d.ServiceProviderName ?? '-',
    mainService:        d.MainServiceName ?? '-',
    subService:         d.SubServiceName ?? '-',
    mainClassification: d.ComplaintMainCategoryName ?? '-',
    subClassification:  d.ComplaintSubCategoryName ?? '-',
    // فئة الشكوى — backend returns it as EntityTypeName from /Complain/GetComplainDetails.
    complaintCategory:  d.EntityTypeName ?? '-',
    complainQuestions:  mapComplainQuestions(d.ComplainQuestions),
    branch:             d.RegionName ?? '-',
    channel:            d.EntityTypeName ?? '-',
    createdAt:          fmtDate(d.CreatedOn),
    createdBy:          d.CreatedByName ?? '-',
    updatedAt:          fmtDate(d.ModifiedOn),
    updatedBy:          d.ModifiedByName ?? '-',
    slaDue:             '-',
    description:        d.Description ?? '-',
    attachments:        (d.Attachments ?? []).map(a => ({ id: a.Id, fileName: a.FileName })),
  };
}
