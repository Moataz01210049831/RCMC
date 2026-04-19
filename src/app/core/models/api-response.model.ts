export interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T;
  MetaData: unknown;
  TotalCount: number;
}
