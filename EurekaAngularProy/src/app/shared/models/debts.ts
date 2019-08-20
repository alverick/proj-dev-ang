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
    status: string;
    payDate: Date;
    canal: string;
    newEmissionDate?: Date;
    newDueDate?: Date;
    newConcept?: string;
    newStatus?:  string;
    selected?: boolean;

    editInput: boolean;
    editButton: boolean;
}

export interface DebtsPagedList {
    count: number;
    data: Debts[];
}
