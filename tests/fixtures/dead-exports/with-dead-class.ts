/**
 * Test fixture: File with exported class that is never imported
 */

export class UsedClass {
  public getValue(): string {
    return 'used';
  }
}

export class UnusedClass {
  private value: number = 0;

  public setValue(val: number): void {
    this.value = val;
  }

  public getValue(): number {
    return this.value;
  }
}
