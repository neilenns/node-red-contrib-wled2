/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export function hexToRgb(hex: string): number[] {
  if (!hex) {
    return [0, 0, 0];
  }

  return hex
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b)
    .substring(1)
    .match(/.{2}/g)
    .map(x => parseInt(x, 16));
}
