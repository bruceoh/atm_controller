import { Account, ATM, Bank, User } from '../src';
import {
  CreateCardError,
  NoInsertedCardError,
  NotEnoughBalanceError,
  TerminateError,
  UnauthorizedError,
  UnavailableError,
} from '../src/exceptions';

describe('App Test', () => {
  const bank = Bank.getInstance();

  let atm: ATM;
  let defaultUser: User;
  let defaultPin: string = '0000';

  beforeAll(() => {
    atm = new ATM(bank);
    defaultUser = new User('David');
    bank.removeAccountList();
  });

  beforeEach(() => {
    atm.dispose();
    bank.removeAccountList();
    bank.createAccount(defaultUser);
  });

  describe('Create Account', () => {
    it('User Account Count Test', () => {
      const card = bank.createCard(defaultUser, defaultPin);

      atm.insertCard(card);
      atm.enterPin(defaultPin);
      const accountList = atm.getAccountList();

      expect(accountList.length).toBeGreaterThan(0);
    });

    it('No Account Test', () => {
      bank.removeAccountList();
      const card = bank.createCard(defaultUser, defaultPin);

      atm.insertCard(card);
      atm.enterPin(defaultPin);

      expect(() => {
        atm.checkBalance();
      }).toThrow(UnauthorizedError);
    });

    it('Same User Account Test', () => {
      const card = bank.createCard(defaultUser, defaultPin);

      atm.insertCard(card);
      atm.enterPin(defaultPin);
      const accountList = atm.getAccountList();

      const single = accountList[0];
      expect(single.getAccountHolder().getKey()).toBe(defaultUser.getKey());
    });

    it('Multiple Account Test', () => {
      bank.createAccount(defaultUser);
      bank.createAccount(defaultUser);
      bank.createAccount(defaultUser);

      const card = bank.createCard(defaultUser, defaultPin);

      atm.insertCard(card);
      atm.enterPin(defaultPin);
      const accountList = atm.getAccountList();

      expect(accountList.length).toBe(4);
    });
  });

  describe('Card Test', () => {
    it('Create Card Test', () => {
      expect(() => {
        bank.createCard(defaultUser, '123');
      }).toThrow(CreateCardError);
    });

    it('Enter Two Card Test', () => {
      const card = bank.createCard(defaultUser, defaultPin);
      atm.insertCard(card);

      expect(() => {
        atm.insertCard(card);
      }).toThrow(UnavailableError);
    });

    it('Enter Pin without Card Test', () => {
      expect(() => {
        atm.enterPin(defaultPin);
      }).toThrow(NoInsertedCardError);
    });

    it('Incorrect Pin Test', () => {
      const card = bank.createCard(defaultUser, defaultPin);
      atm.insertCard(card);

      const firstTry = atm.enterPin('1234');
      expect(firstTry).toBe(false);

      const secondTry = atm.enterPin('1234');
      expect(secondTry).toBe(false);

      expect(() => {
        atm.enterPin('1234');
      }).toThrow(TerminateError);
    });
  });

  describe('Transaction Test', () => {
    beforeEach(() => {
      const card = bank.createCard(defaultUser, defaultPin);
      atm.insertCard(card);
      atm.enterPin(defaultPin);
      const accountList = atm.getAccountList();

      atm.selectAccount(accountList[0]);
    });

    it('Get Balance Test', () => {
      const balance = atm.checkBalance();
      expect(balance).toBe(0);
    });

    it('Get Default Balance Test', () => {
      const account = bank.createAccount(defaultUser, 2000);
      const accountList = atm.getAccountList();

      atm.selectAccount(accountList[accountList.length - 1]);

      const balance = atm.checkBalance();
      expect(balance).toBe(2000);
    });

    it('Deposit Test', () => {
      const accountList = atm.getAccountList();

      atm.selectAccount(accountList[0]);

      const balance = atm.checkBalance();
      expect(balance).toBe(0);

      atm.deposit(1230);
      const newBalance = atm.checkBalance();
      expect(newBalance).toBe(1230);
    });

    it('Deposit All Test', () => {
      const accountList = atm.getAccountList();
      bank.createAccount(defaultUser, 100);
      bank.createAccount(defaultUser, 200);
      bank.createAccount(defaultUser, 300);

      for (let i = 0; i < accountList.length; i++) {
        atm.selectAccount(accountList[i]);

        const balance = atm.checkBalance();
        expect(balance).toBe(0 + i * 100);

        atm.deposit(1000);
        const newBalance = atm.checkBalance();
        expect(newBalance).toBe(1000 + i * 100);
      }
    });

    it('Withdraw Not Enough Balance Test', () => {
      const accountList = atm.getAccountList();

      atm.selectAccount(accountList[0]);

      expect(() => {
        atm.withdraw(1000);
      }).toThrow(NotEnoughBalanceError);
    });

    it('Withdraw Balance Test', () => {
      const accountList = atm.getAccountList();

      atm.selectAccount(accountList[0]);

      atm.deposit(1000);
      atm.withdraw(500);

      const balance1 = atm.checkBalance();
      expect(balance1).toBe(500);

      atm.withdraw(500);
      const balance2 = atm.checkBalance();
      expect(balance2).toBe(0);
    });
  });

  describe('Dispose Test', () => {
    it('Valid ATM Dispose Test - Get AccountList Error', () => {
      atm.dispose();

      expect(() => {
        atm.getAccountList();
      }).toThrow(UnauthorizedError);
    });

    it('Valid ATM Dispose Test - Get NoInsertedCard Error', () => {
      atm.dispose();

      expect(() => {
        atm.enterPin(defaultPin);
      }).toThrow(NoInsertedCardError);
    });

    it('Valid ATM Dispose Test - No Account Error', () => {
      const card = bank.createCard(defaultUser, '1111');
      bank.removeAccountList();
      expect(bank.getAccountList(card).length).toBe(0);
    });

    it('Dispose and Insert New Card', () => {
      const user = new User('bruce');
      const card = bank.createCard(user, '1111');
      atm.insertCard(card);
      atm.enterPin('1111');

      const accountList = atm.getAccountList();

      expect(accountList.length).toBe(0);
    });
  });
});
