export interface Debts {
  id: number;
  emissionDate: Date | string;
  dueDate?: Date | string;
  code: string;
  firstName: string;
  lastName: string;
  service: string;
  currency: string;
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
  newEmissionDate?: Date | string;
  newDueDate?: Date | string;
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
  data: Debts[];
}
