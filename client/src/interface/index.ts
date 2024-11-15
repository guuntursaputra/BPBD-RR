export interface BankSuggestion {
    id: number;
    account: string;
    branchBank: string;
    bankName: string;
}

export interface FormData {
    name: string;
    NIK: string;
    gender: string;
    accountNumber: string;
    bankName: string;
    branchBank: string;
    bankId: number;
}