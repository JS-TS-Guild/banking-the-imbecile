
import BankAccount from './bank-account';
import Bank from './bank';
import { v4 as uuidv4 } from 'uuid';
export default class User {
    private id:string;
    private name:string;
    private accountIds: string[];
    private static usersMap: Map<string, User> = new Map();

    private constructor(id: string, name: string, accountIds:string[]) {
        this.id = id;
        this.name = name;
        this.accountIds = accountIds;
        for (const accountId of accountIds) {
            const bankAccount = BankAccount.getById(accountId);
            const bank = Bank.getById(bankAccount.getBankId());
            bank.setUserAccount(this.id, accountId);
        }
    }

    static create(name:string, accountIds:string[]):User {
        const id = uuidv4();
        const user = new User(id, name, accountIds);
        User.usersMap.set(id, user);
        return user;
    }

    static getById(id: string): User{
        return User.usersMap.get(id);
    } 
    getId() {
        return this.id;
    }
    getAccount() {
        return this.accountIds;
    }
    
}