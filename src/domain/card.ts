import { CreateCardError } from '../exceptions';
import User from './user';

class Card {
  private holder: User;
  private pin: string;

  constructor(user: User, pin: string = '0000') {
    this.holder = user;
    this.validatePin(pin);
    this.pin = pin;
  }

  getHolder() {
    return this.holder;
  }

  checkPin(pin: string) {
    return pin === this.pin;
  }

  private validatePin(pin: string) {
    if (pin.length !== 4) {
      throw new CreateCardError();
    }
  }
}

export default Card;
