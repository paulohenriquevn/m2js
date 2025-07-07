/**
 * Test fixture: Consumer that imports everything from clean-file
 */

import {
  alwaysUsed,
  AlwaysUsedClass,
  ALWAYS_USED_CONSTANT,
} from './clean-file';

export function useEverything(): string {
  const result = alwaysUsed();
  const instance = new AlwaysUsedClass();
  instance.method();

  return `${result} - ${ALWAYS_USED_CONSTANT}`;
}
