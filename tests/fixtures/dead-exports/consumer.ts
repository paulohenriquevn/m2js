/**
 * Test fixture: File that imports some exports (making them "used")
 */

import { usedFunction } from './with-dead-function';
import { UsedClass } from './with-dead-class';
import { USED_CONSTANT } from './with-dead-variable';

export function useImportedStuff(): string {
  const result = usedFunction();
  const instance = new UsedClass();
  const value = instance.getValue();

  return `${result} - ${value} - ${USED_CONSTANT}`;
}
