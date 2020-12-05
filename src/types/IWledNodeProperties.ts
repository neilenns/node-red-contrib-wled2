/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { NodeProperties } from "node-red";
import IWledSegment from "./IWledSegment";

export default interface IWledNodeProperties extends NodeProperties {
  address: string;
  brightness: number;
  enableBrightness?: boolean;
  color1: string; // Comes in as #aabbcc
  enableColor1?: boolean;
  color2: string; // Comes in as #aabbcc
  enableColor2?: boolean;
  color3: string; // Comes in as #aabbcc
  enableColor3?: boolean;
  effect: number;
  enableEffect?: boolean;
  effectIntensity: number;
  enableEffectIntensity?: boolean;
  effectSpeed: number;
  enableEffectSpeed?: boolean;
  name: string;
  state: string;
  enableState?: boolean;
  delay: number;
  enableDelay?: boolean;
  palette: number;
  enablePalette?: boolean;
  preset?: number;
  enablePreset?: boolean;
  seg?: IWledSegment[];
}
