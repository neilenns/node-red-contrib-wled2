/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { NodeProperties } from "node-red";
import IWledSegment from "./IWledSegment";

export default interface IWledNodeProperties extends NodeProperties {
  address?: string;
  brightness?: number;
  color1?: string; // Comes in as #aabbcc
  color2?: string; // Comes in as #aabbcc
  color3?: string; // Comes in as #aabbcc
  delay?: number;
  effect?: number;
  effectIntensity?: number;
  effectSpeed?: number;
  name: string;
  palette?: number;
  preset?: number;
  state?: string;
  seg?: IWledSegment[];
}
