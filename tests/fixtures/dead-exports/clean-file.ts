/**
 * Test fixture: File with no dead exports (all are imported)
 */

export function alwaysUsed(): string {
  return 'always used';
}

export class AlwaysUsedClass {
  public method(): void {
    console.log('used method');
  }
}

export const ALWAYS_USED_CONSTANT = 'used';
