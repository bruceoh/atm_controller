import { Account, Bank, Card } from '.';
import {
  NoInsertedCardError,
  UnavailableError,
  TerminateError,
  UnauthorizedError,
  NotEnoughBalanceError,
} from '../exceptions';

class ATM {
  private bank: Bank;
  private isInUse: boolean;
  private currentCard?: Card;
  private retryCount: number;
  private isCardValidated: boolean;
  private selectedAccount?: Account;

  constructor(bank: Bank) {
    this.bank = bank;
    this.isInUse = false;
    this.isCardValidated = false;
    this.retryCount = 0;
  }

  public insertCard(card: Card) {
    if (this.isInUse) {
      throw new UnavailableError();
    }
    this.isInUse = true;
    this.currentCard = card;
  }

  public enterPin(pin: string) {
    if (!this.currentCard) {
      throw new NoInsertedCardError();
    }

    const isPinPassed = this.checkPin(pin);
    if (!isPinPassed) {
      if (this.retryCount === 2) {
        this.exitCard();
        throw new TerminateError();
      }

      this.retryCount += 1;
      return false;
    }

    this.isCardValidated = true;
    return true;
  }

  public getAccountList() {
    if (!this.validateCard() || !this.currentCard) {
      this.exitCard();
      throw new UnauthorizedError();
    }

    const accountList = this.bank.getAccountList(this.currentCard);

    return accountList;
  }

  public selectAccount(account: Account) {
    const accountList = this.getAccountList();
    const findOne = accountList.find((elem) => elem.getKey() === account.getKey());

    if (!findOne) {
      this.exitCard();
      throw new UnauthorizedError();
    }

    this.selectedAccount = account;
    return account;
  }

  public checkBalance() {
    if (!this.validateAccount() || !this.selectedAccount) {
      this.exitCard();
      throw new UnauthorizedError();
    }

    return this.selectedAccount.getBalance();
  }

  public deposit(amount: number) {
    if (!this.validateAccount() || !this.selectedAccount || !this.currentCard) {
      this.exitCard();
      throw new UnauthorizedError();
    }

    const totalBalance = this.selectedAccount.deposit(amount);
    return totalBalance;
  }

  public withdraw(amount: number) {
    if (!this.validateAccount() || !this.selectedAccount || !this.currentCard) {
      this.exitCard();
      throw new UnauthorizedError();
    }

    const currentBalance = this.selectedAccount.getBalance();

    if (amount > currentBalance) {
      throw new NotEnoughBalanceError();
    }

    const totalBalance = this.selectedAccount.withdraw(amount);
    return totalBalance;
  }

  public dispose() {
    this.exitCard();
  }

  private validateAccount() {
    if (!this.validateCard() || !this.currentCard || !this.selectedAccount) {
      return false;
    }

    return true;
  }
  private validateCard() {
    if (!this.isInUse || !this.isCardValidated) {
      return false;
    }

    return true;
  }

  private exitCard() {
    this.isInUse = false;
    this.currentCard = undefined;
    this.retryCount = 0;
    this.isCardValidated = false;
    this.selectedAccount = undefined;
  }

  private checkPin(pin: string) {
    if (!this.currentCard) {
      throw new NoInsertedCardError();
    }

    return this.currentCard.checkPin(pin);
  }
}

export default ATM;
