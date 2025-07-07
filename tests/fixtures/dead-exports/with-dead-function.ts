/**
 * Test fixture: File with exported function that is never imported
 */

export function usedFunction(): string {
  return 'This function is used';
}

export function unusedFunction(): number {
  return 42;
}

// This is not exported, so it shouldn't appear in dead exports
function privateFunction(): void {
  console.log('private');
}
