/**
 * Test fixture: File with no exports at all
 */

function internalFunction(): string {
  return 'internal';
}

const internalConstant = 'not exported';

class InternalClass {
  public method(): void {
    console.log('internal method');
  }
}

// No exports in this file
console.log('This file has no exports');
