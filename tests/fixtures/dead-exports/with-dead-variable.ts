/**
 * Test fixture: File with exported variables that are never imported
 */

export const USED_CONSTANT = 'this is used';

export const UNUSED_CONSTANT = 42;

export let unusedVariable = 'nobody imports this';

// Default export that's also unused
export default function unusedDefaultFunction(): void {
  console.log('unused default');
}
