/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { NodeProperties } from "node-red";
import IWledSegment from "./IWledSegment";

export default interface IWledNodeProperties extends NodeProperties {
  address: string;
  segmentId: number;
  brightness: number;
  color1: string; // Comes in as #aabbcc
  color2: string; // Comes in as #aabbcc
  color3: string; // Comes in as #aabbcc
  effect: number;
  effectIntensity: number;
  effectSpeed: number;
  name: string;
  state: string;
  debug: string;
  delay: number;
  palette: number;
  preset?: number;
  seg?: IWledSegment[];
}
