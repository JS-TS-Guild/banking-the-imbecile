import { v4 as uuidv4 } from "uuid";
import BankAccount from "./bank-account";
type options ={
    isNegativeAllowed: boolean;
}
export default class Bank {
    private id:string;
    private options?: options;
    private accounts:string[];
    private static banksMap:Map<string,Bank> = new Map();
    private userAccountsMap: Map<string,string[]>;
    
    private constructor(id : string, options: any) {
    this.id = id;
    this.options = options;
    this.accounts = [];
    this.userAccountsMap = new Map();
    }
    static create(options?:any) {
        const id = uuidv4();
        const bank = new Bank(id, options);
        Bank.banksMap.set(id, bank);
        return bank;
    }
    createAccount(amount: number) {
        const account = BankAccount.create(this.id, amount);
        this.accounts.push(account.getId());
        return account;
    }
    static getById(id:string) {
        return Bank.banksMap.get(id);
    }
    getId() {
        return this.id;
    }
    getAccount(bankAccountId: string) {
        return BankAccount.getById(bankAccountId);
    }
    doesAllowNegativeBalance(): boolean{
        return this.options?.isNegativeAllowed ?? false;
    }
    setUserAccount(userId: string, accountId:string) {
        const userAccounts = this.userAccountsMap.get(userId) ?? [];
        userAccounts.push(accountId);
        this.userAccountsMap.set(userId, userAccounts);
    }
    getUserAccount(userId: string) {
        return this.userAccountsMap.get(userId);
    }
    send(fromUserId: string, toUserId: string, amount: number, toBankId?: string) {
        const fromUserAccts = this.userAccountsMap.get(fromUserId);
        const toBank = toBankId ? Bank.getById(toBankId) : this;
        const toUserAccts = toBank.getUserAccount(toUserId);

        if (!fromUserAccts || fromUserAccts.length === 0) {
            throw new Error('Sender Bank account not found in this bank.');
        }
        if (!toUserAccts || toUserAccts.length === 0) {
            throw new Error('Receiver Bank account not found.');
        }
        if (fromUserId === toUserId && (!toBankId || toBankId === this.id)){
            throw new Error('Cannot Transfer to the same user in same bank.')
        }

        let amountToDebit = amount;
        const fromAccts = fromUserAccts.map(id => BankAccount.getById(id));
        const senderBalance = fromAccts.reduce((sum, account) => sum + (account?.getBalance() ?? 0), 0)
        
        if (senderBalance < amount && !this.doesAllowNegativeBalance()) {
            throw new Error("Insufficient funds");
        }
        for (const account of fromAccts) {
            if (amountToDebit <= 0) break;
            if (!account) continue;
            const debitAmount = Math.min(amountToDebit, account.getBalance());
            if (debitAmount > 0) {
                account.setBalance(account.getBalance() - debitAmount);
                amountToDebit -= debitAmount;
            }
        }

        if (amountToDebit > 0 && this.doesAllowNegativeBalance()) {
            const firstAcct = fromAccts[0];
            if (firstAcct) {
                firstAcct.setBalance(firstAcct.getBalance() - amountToDebit);
            }
        }

        const toAcct = BankAccount.getById(toUserAccts[0]);
        if (toAcct) {
            toAcct.setBalance(toAcct.getBalance() + amount);
        }
    }

}