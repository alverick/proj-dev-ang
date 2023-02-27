export interface Debts {
  id: number;
  emissionDate: Date;
  dueDate?: Date;
  code: string;
  firstName: string;
  lastName: string;
  service: string;
  svcStatus?: number;
  concept: string;
  amount: number;
  amountPayed?: number;
  interestAmount?: number;
  totalAmount?: number;
  totalAmountPayed?: number;
  status: string;
  payDate: Date;
  channel: string;
  hasIBKPayments: boolean;
  newEmissionDate?: Date;
  newDueDate?: Date;
  newConcept?: string;
  newAmount?: string;
  newStatus?: string;
  newFirstName?: string;
  newLastName?: string;
  selected?: boolean;
  serviceType?: string;

  editPending: boolean;
  editInput: boolean;
  editButton: boolean;

  errores?: any;
}

export interface DebtsPagedList {
  count: number;
  countNoIbkPayments: number;
  data: any;
}
