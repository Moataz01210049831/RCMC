export type ComplaintRequirementType = 'text' | 'dropdown' | 'date' | 'file' | string;

export interface ComplaintRequirement {
  Id: string;
  Name: string;
  Required: boolean;
  Type: ComplaintRequirementType;
  Value: any;
  ReadOnly: boolean;
  Options: string[];
}
