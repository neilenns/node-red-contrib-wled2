/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import IWledNodeProperties from "./IWledNodeProperties";
import * as Red from "node-red";
import WledDevice from "../WledDevice";

export default interface IWledNode extends Red.Node {
  config: IWledNodeProperties;
  solidTimer: NodeJS.Timeout;
  wled: WledDevice;
}
