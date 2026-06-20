interface NamedRef {
  id:   string;
  name: string | null;
}

export interface ComplainSLAItem {
  entityID:               string;
  caseId:                 string;
  slaItemId:              string;
  stepDecision:           NamedRef | null;
  communicationProcedure: NamedRef | null;
  notes:                  string | null;
  endOn:                  string | null;
  overdueDate:            string | null;
  decisionTakenBy:        string | null;
  decisionTakenByContact: string | null;
  decisionTakenByMain:    string | null;
  modifiedOn:             string | null;
  takenBy:                NamedRef | null;
}
