import { User } from '.';

class Account {
  private accountHolder: User;
  private key: string;
  private balance: number;

  constructor(accountHolder: User, initialBalance: number = 0) {
    this.accountHolder = accountHolder;
    this.key = new Date().getTime().toString(36) + 'a';
    this.balance = initialBalance;
  }

  public withdraw(amount: number) {
    this.balance -= amount;

    return this.balance;
  }

  public deposit(amount: number) {
    this.balance += amount;

    return this.balance;
  }

  public getBalance() {
    return this.balance;
  }

  public getKey() {
    return this.key;
  }

  public getAccountHolder() {
    return this.accountHolder;
  }
}

export default Account;
