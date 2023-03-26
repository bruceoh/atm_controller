export class UnavailableError extends Error {
  constructor() {
    super();
    this.message = 'ATM is in use';
  }
}

export class NoInsertedCardError extends Error {
  constructor() {
    super();
    this.message = 'no card is inserted';
  }
}

export class IncorrectPinError extends Error {
  constructor() {
    super();
    this.message = 'pin is not correct';
  }
}

export class TerminateError extends Error {
  constructor() {
    super();
    this.message = 'ATM is terminated';
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super();
    this.message = 'you cannot access right now';
  }
}

export class NotEnoughBalanceError extends Error {
  constructor() {
    super();
    this.message = 'not enough nalance error';
  }
}
