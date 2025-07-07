/**
 * Test fixture: File with mix of used and unused imports
 */

import { usedFunction } from './with-dead-function';
import { UsedClass, UnusedClass } from './with-dead-class';
import { USED_CONSTANT, UNUSED_CONSTANT } from './with-dead-variable';

export function demonstrateUsage(): string {
  const result = usedFunction();
  const instance = new UsedClass();
  const value = instance.getValue();
  
  // UnusedClass and UNUSED_CONSTANT are imported but never used
  return `${result} - ${value} - ${USED_CONSTANT}`;
}