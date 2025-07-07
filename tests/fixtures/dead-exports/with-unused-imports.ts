/**
 * Test fixture: File with unused imports
 */

import { usedFunction } from './with-dead-function';
import { UnusedClass } from './with-dead-class'; // This import is never used
import React from 'react'; // This import is never used
import * as fs from 'fs'; // This namespace import is never used

export function someFunction(): string {
  // Only usedFunction is actually used
  return usedFunction();
}
