export type TicketType = 'complaints' | 'requests' | 'inquiries' | 'suggestions';

export interface TicketListItem {
  code: string;
  statusKey: string;
}

export interface TicketDetail {
  code: string;
  statusKey: string;
  entityType: string;
  entityId: string;
  mainClassification: string;
  subClassification: string;
  channel: string;
  requirements: string;
  branch: string;
  mainService: string;
  subService: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  slaDue: string;
  description: string;
}

export interface TabDef {
  type: TicketType;
  labelKey: string;
  addLabelKey: string;
}

export const TABS: TabDef[] = [
  { type: 'complaints',  labelKey: 'TICKETS.COMPLAINTS',  addLabelKey: 'TICKETS.ADD_COMPLAINT'  },
  { type: 'inquiries',   labelKey: 'TICKETS.INQUIRIES',   addLabelKey: 'TICKETS.ADD_INQUIRY'    },
  { type: 'suggestions', labelKey: 'TICKETS.SUGGESTIONS', addLabelKey: 'TICKETS.ADD_SUGGESTION' },
  { type: 'requests',    labelKey: 'TICKETS.REQUESTS',    addLabelKey: 'TICKETS.ADD_REQUEST'    },
];

export const MOCK_TICKETS: Record<TicketType, TicketListItem[]> = {
  complaints: [
    { code: 'A8373482', statusKey: 'STATUS.UNDER_PROCEDURE' },
    { code: 'B1234567', statusKey: 'STATUS.UNDER_PROCEDURE' },
    { code: 'C7654321', statusKey: 'STATUS.UNDER_PROCEDURE' },
    { code: 'D9876543', statusKey: 'STATUS.UNDER_PROCEDURE' },
    { code: 'E5432107', statusKey: 'STATUS.UNDER_PROCEDURE' },
  ],
  requests: [
    { code: 'R1000001', statusKey: 'STATUS.NEW' },
    { code: 'R1000002', statusKey: 'STATUS.IN_PROGRESS' },
    { code: 'R1000003', statusKey: 'STATUS.CLOSED' },
  ],
  inquiries: [
    { code: 'I2000001', statusKey: 'STATUS.NEW' },
    { code: 'I2000002', statusKey: 'STATUS.CLOSED' },
  ],
  suggestions: [
    { code: 'S3000001', statusKey: 'STATUS.IN_PROGRESS' },
  ],
};

export function buildMockDetail(item: TicketListItem): TicketDetail {
  return {
    code: item.code,
    statusKey: item.statusKey,
    entityType: 'العرض للتقن',
    entityId: 'A8373465',
    mainClassification: 'مشكلة دخول الحساب',
    subClassification: 'رمز التحقق فعمل',
    channel: 'مركز الاتصال',
    requirements: 'نسخ للضم كريم',
    branch: 'الوزارة',
    mainService: 'سجل تجاري',
    subService: 'طباعة السجل التجاري',
    createdAt: '12/2/2025 12:23pm',
    createdBy: 'عزت مجد',
    updatedAt: '12/2/2025 12:23pm',
    updatedBy: 'عزت مجد',
    slaDue: '2 ساعة',
    description:
      'هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيليه القارئ عن التركيز على الشكل الخارجي للنص أو شكل توضع الفقرات في الصفحة التي يقرأها.',
  };
}
