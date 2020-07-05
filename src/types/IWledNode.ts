/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import WledDevice from "../WledDevice";
import * as Red from "node-red";
import IWledNodeProperties from "./IWledNodeProperties";

export default interface IWledNode extends Red.Node {
  wled: WledDevice;
  config: IWledNodeProperties;
  solidTimer: NodeJS.Timeout;
}
