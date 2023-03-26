export class CreateCardError extends Error {
  constructor() {
    super();
    this.message = 'Error in creating a card';
  }
}
