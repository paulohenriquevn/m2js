/**
 * Test fixture: File with mix of used and unused exports
 */

// This will be used by consumer
export function importantFunction(): string {
  return 'important';
}

// These will be dead exports
export function deadFunction1(): void {
  console.log('dead1');
}

export function deadFunction2(): number {
  return 999;
}

export class DeadClass {
  public doSomething(): void {
    console.log('dead class method');
  }
}

export const DEAD_CONSTANT = 'unused constant';

// Private function - should not appear in analysis
function internalHelper(): boolean {
  return true;
}
