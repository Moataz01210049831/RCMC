import type { LookupItem } from '../models/lookup.model';

export const DUMMY_REGIONS: LookupItem[] = [
  { Name: 'الرياض',            Value: 'region-01' },
  { Name: 'مكة المكرمة',       Value: 'region-02' },
  { Name: 'المدينة المنورة',   Value: 'region-03' },
  { Name: 'المنطقة الشرقية',   Value: 'region-04' },
  { Name: 'القصيم',            Value: 'region-05' },
  { Name: 'عسير',              Value: 'region-06' },
  { Name: 'تبوك',              Value: 'region-07' },
  { Name: 'حائل',              Value: 'region-08' },
  { Name: 'الحدود الشمالية',   Value: 'region-09' },
  { Name: 'جازان',             Value: 'region-10' },
  { Name: 'نجران',             Value: 'region-11' },
  { Name: 'الباحة',            Value: 'region-12' },
  { Name: 'الجوف',             Value: 'region-13' },
];

export const DUMMY_CITIES: LookupItem[] = [
  { Name: 'الرياض',          Value: 'city-01' },
  { Name: 'جدة',             Value: 'city-02' },
  { Name: 'مكة المكرمة',     Value: 'city-03' },
  { Name: 'المدينة المنورة', Value: 'city-04' },
  { Name: 'الدمام',          Value: 'city-05' },
  { Name: 'الخبر',           Value: 'city-06' },
  { Name: 'الطائف',          Value: 'city-07' },
  { Name: 'بريدة',           Value: 'city-08' },
  { Name: 'تبوك',            Value: 'city-09' },
  { Name: 'أبها',            Value: 'city-10' },
  { Name: 'خميس مشيط',      Value: 'city-11' },
  { Name: 'حائل',            Value: 'city-12' },
  { Name: 'ينبع',            Value: 'city-13' },
  { Name: 'الأحساء',         Value: 'city-14' },
  { Name: 'القطيف',          Value: 'city-15' },
  { Name: 'الجبيل',          Value: 'city-16' },
  { Name: 'نجران',           Value: 'city-17' },
  { Name: 'جازان',           Value: 'city-18' },
];

export const DUMMY_SERVICE_PROVIDERS: LookupItem[] = [
  { Name: 'مقدم خدمة 1', Value: 'sp-01' },
  { Name: 'مقدم خدمة 2', Value: 'sp-02' },
  { Name: 'مقدم خدمة 3', Value: 'sp-03' },
  { Name: 'مقدم خدمة 4', Value: 'sp-04' },
  { Name: 'مقدم خدمة 5', Value: 'sp-05' },
];

export const DUMMY_COMPLAINT_MAIN_CATEGORIES: LookupItem[] = [
  { Name: 'شكوى عن خدمة',   Value: 'cmp-main-01' },
  { Name: 'شكوى عن موظف',   Value: 'cmp-main-02' },
  { Name: 'شكوى عن منشأة',  Value: 'cmp-main-03' },
  { Name: 'شكوى أخرى',      Value: 'cmp-main-04' },
];

export const DUMMY_COMPLAINT_SUB_CATEGORIES: Record<string, LookupItem[]> = {
  'cmp-main-01': [
    { Name: 'تأخر في تقديم الخدمة', Value: 'cmp-sub-0101' },
    { Name: 'جودة الخدمة',          Value: 'cmp-sub-0102' },
    { Name: 'عدم توفر الخدمة',      Value: 'cmp-sub-0103' },
  ],
  'cmp-main-02': [
    { Name: 'سوء معاملة',           Value: 'cmp-sub-0201' },
    { Name: 'تقصير في العمل',       Value: 'cmp-sub-0202' },
  ],
  'cmp-main-03': [
    { Name: 'نظافة',                Value: 'cmp-sub-0301' },
    { Name: 'صلاحية المرافق',       Value: 'cmp-sub-0302' },
  ],
  'cmp-main-04': [
    { Name: 'أخرى',                 Value: 'cmp-sub-0401' },
  ],
};

export const DUMMY_INQUIRY_MAIN_CATEGORIES: LookupItem[] = [
  { Name: 'استفسار عن خدمة',  Value: 'inq-main-01' },
  { Name: 'استفسار عن إجراء', Value: 'inq-main-02' },
  { Name: 'استفسار قانوني',   Value: 'inq-main-03' },
  { Name: 'استفسار إداري',    Value: 'inq-main-04' },
  { Name: 'استفسار عام',      Value: 'inq-main-05' },
];

export const DUMMY_INQUIRY_SUB_CATEGORIES: Record<string, LookupItem[]> = {
  'inq-main-01': [
    { Name: 'استخراج تأشيرة',          Value: 'inq-sub-0101' },
    { Name: 'تجديد رخصة',              Value: 'inq-sub-0102' },
    { Name: 'الخدمات الإلكترونية',     Value: 'inq-sub-0103' },
    { Name: 'خدمات الأحوال المدنية',   Value: 'inq-sub-0104' },
  ],
  'inq-main-02': [
    { Name: 'نقل الخدمات',             Value: 'inq-sub-0201' },
    { Name: 'تقديم طلب جديد',          Value: 'inq-sub-0202' },
    { Name: 'تعديل بيانات',            Value: 'inq-sub-0203' },
    { Name: 'متابعة طلب قائم',         Value: 'inq-sub-0204' },
  ],
  'inq-main-03': [
    { Name: 'استفسار عن نظام',         Value: 'inq-sub-0301' },
    { Name: 'استفسار عن لائحة',        Value: 'inq-sub-0302' },
    { Name: 'استفسار عن عقوبات',       Value: 'inq-sub-0303' },
  ],
  'inq-main-04': [
    { Name: 'مواعيد العمل',            Value: 'inq-sub-0401' },
    { Name: 'مواقع الفروع',            Value: 'inq-sub-0402' },
    { Name: 'وسائل التواصل',           Value: 'inq-sub-0403' },
  ],
  'inq-main-05': [
    { Name: 'معلومات عامة',            Value: 'inq-sub-0501' },
    { Name: 'آخر التحديثات',           Value: 'inq-sub-0502' },
    { Name: 'أخرى',                    Value: 'inq-sub-0503' },
  ],
};

export const DUMMY_COUNTRIES: LookupItem[] = [
  { Name: 'السعودية',          Value: 'country-01' },
  { Name: 'مصر',               Value: 'country-02' },
  { Name: 'الأردن',            Value: 'country-03' },
  { Name: 'سوريا',             Value: 'country-04' },
  { Name: 'اليمن',             Value: 'country-05' },
  { Name: 'السودان',           Value: 'country-06' },
  { Name: 'باكستان',           Value: 'country-07' },
  { Name: 'الهند',             Value: 'country-08' },
  { Name: 'بنغلاديش',          Value: 'country-09' },
  { Name: 'الفلبين',           Value: 'country-10' },
  { Name: 'إندونيسيا',         Value: 'country-11' },
  { Name: 'إثيوبيا',           Value: 'country-12' },
  { Name: 'تركيا',             Value: 'country-13' },
  { Name: 'المغرب',            Value: 'country-14' },
  { Name: 'الجزائر',           Value: 'country-15' },
  { Name: 'تونس',              Value: 'country-16' },
  { Name: 'الكويت',            Value: 'country-17' },
  { Name: 'الإمارات',          Value: 'country-18' },
  { Name: 'قطر',               Value: 'country-19' },
  { Name: 'البحرين',           Value: 'country-20' },
  { Name: 'عُمان',             Value: 'country-21' },
  { Name: 'العراق',            Value: 'country-22' },
  { Name: 'لبنان',             Value: 'country-23' },
  { Name: 'فلسطين',            Value: 'country-24' },
  { Name: 'الولايات المتحدة',  Value: 'country-25' },
  { Name: 'المملكة المتحدة',   Value: 'country-26' },
  { Name: 'فرنسا',             Value: 'country-27' },
  { Name: 'ألمانيا',           Value: 'country-28' },
];
