import { Account, Card, User } from '.';

class Bank {
  private static instance: Bank;
  private accountList: Array<Account> = [];

  public static getInstance() {
    return this.instance || (this.instance = new this());
  }

  public createCard(user: User, pin?: string) {
    const card = new Card(user, pin);
    return card;
  }

  public createAccount(user: User, initialBalance: number = 0) {
    const account = new Account(user, initialBalance);
    this.accountList.push(account);
    return account;
  }

  public getAccountList(card: Card) {
    const holderKey = card.getHolder().getKey();

    const accountList = this.accountList.filter(
      (account) => account.getAccountHolder().getKey() === holderKey
    );
    return accountList;
  }

  public removeAccountList() {
    this.accountList = [];
  }
}

export default Bank;
