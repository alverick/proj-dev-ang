export interface Debts {
    id: number;
    emissionDate: Date;
    dueDate: Date;
    code: string;
    firstName: string;
    lastName: string;
    service: string;
    concept: string;
    amount: number;
    amountPayed?: number;
    status: string;
    payDate: Date;
    channel: string;
    newEmissionDate?: Date;
    newDueDate?: Date;
    newConcept?: string;
    newAmount?: number;
    newStatus?:  string;
    selected?: boolean;

    editPending: boolean;
    editInput: boolean;
    editButton: boolean;
}

export interface DebtsPagedList {
    count: number;
    data: Debts[];
}
