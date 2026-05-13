export interface LookupItem {
  Name: string;
  Value: string;
  Child?: LookupChild | null;
}

export interface LookupChild {
  Name: string;
  Value: string;
}
