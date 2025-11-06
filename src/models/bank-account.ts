import { v4 as uuidv4 } from 'uuid';
export default class BankAccount{
    private id: string;
    private bankId: string;
    private balance: number;
    private static bankAccountsMap: Map<string, BankAccount> = new Map();

    private constructor(id: string, bankId: string, balance: number) {
        this.id = id;
        this.bankId = bankId;
        this.balance = balance;
    }

    static create(bankId: string, initialBalance: number) {
        const id = uuidv4();
        const bankAccount = new BankAccount(id, bankId, initialBalance);
        BankAccount.bankAccountsMap.set(id, bankAccount);
        return bankAccount;

    }
    static getById(id: string) {
        return BankAccount.bankAccountsMap.get(id);
    }
    getId() {
        return this.id;
    }
    getBankId() {
        return this.bankId;
    }
    getBalance() {
        return this.balance;
    }
    setBalance(newBalance: number) {
        this.balance = newBalance;
    }
}