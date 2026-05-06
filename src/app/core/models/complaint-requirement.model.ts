export type ComplaintRequirementType = 'text' | 'number' | 'dropdown' | 'date' | 'file' | 'radio' | 'multipleselect' | string;

export interface ComplaintRequirement {
  Id: string;
  Name: string;
  Required: boolean;
  Type: ComplaintRequirementType;
  Value: any;
  ReadOnly: boolean;
  Options: string[];
}
