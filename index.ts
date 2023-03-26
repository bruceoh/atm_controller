import { Bank, ATM, User } from './src';

function run() {
  const bank = Bank.getInstance();
  const atm = new ATM(bank);

  const user = new User('David');
  bank.createAccount(user);
  const card = bank.createCard(user, '1234');

  atm.insertCard(card);
  atm.enterPin('1234');
  const accountList = atm.getAccountList();

  if (accountList.length === 0) {
    return;
  }

  atm.selectAccount(accountList[0]);

  const balance = atm.checkBalance();
  console.log(balance);

  atm.deposit(1000);

  console.log(atm.checkBalance());

  atm.withdraw(500);

  console.log(atm.checkBalance());
}

run();
