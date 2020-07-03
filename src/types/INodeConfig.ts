/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export default interface INodeConfig {
  address: string;
  brightness: number;
  color1: string; // Comes in as #aabbcc
  color2: string; // Comes in as #aabbcc
  color3: string; // Comes in as #aabbcc
  effect: number;
  effectIntensity: number;
  effectSpeed: number;
  name: string;
  on: string;
  delay: number;
  palette: number;
}
