/**
 * Test fixture: File where all imports are actually used
 */

import { usedFunction } from './with-dead-function';
import { UsedClass } from './with-dead-class';
import { USED_CONSTANT } from './with-dead-variable';

export function useAllImports(): string {
  const result = usedFunction();
  const instance = new UsedClass();
  const value = instance.getValue();
  
  return `${result} - ${value} - ${USED_CONSTANT}`;
}