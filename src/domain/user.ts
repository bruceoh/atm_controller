class User {
  private name: string;

  private key: string;

  constructor(name: string) {
    this.name = name;

    this.key = new Date().getTime().toString(36) + 'u';
  }

  public getName() {
    return this.name;
  }

  public getKey() {
    return this.key;
  }

  public compareUser(key: string) {
    return key === this.key;
  }
}

export default User;
