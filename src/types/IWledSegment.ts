/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export default interface IWledSegment {
  id?: number;
  start?: number;
  stop?: number;
  len?: number;
  grp?: number;
  spc?: number;
  on?: boolean;
  bri?: number;
  fx?: number;
  sx?: number;
  ix?: number;
  pal?: number;
  sel?: boolean;
  rev?: boolean;
  col?: number[][];
}
