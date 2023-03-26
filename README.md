## ATM App

Simple ATM Controller

# Installation

```sh
npm install
```

# Usage

- to test this application

```sh
npm run test:e2e
```

- You can run with typescript with <b>'npm run debug'</b>
- You need to get the bank instance to start
- In addition, creating user, card and bank account is required to use ATM's functions

# Example

```jsx
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
```
