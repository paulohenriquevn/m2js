/**
 * Test fixture: Consumer that imports only some exports from mixed-usage
 */

import { importantFunction } from './mixed-usage';

export function useMixedStuff(): string {
  return importantFunction();
}
