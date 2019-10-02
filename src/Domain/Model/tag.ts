export class Tag {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }
  public getTagName() {
    return this.name;
  }
}
