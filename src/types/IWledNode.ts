/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as Red from "node-red";
import IWledNodeProperties from "./IWledNodeProperties";
import WledDevice from "../WledDevice";

export default interface IWledNode extends Red.Node {
  config: IWledNodeProperties;
  solidTimer: NodeJS.Timeout;
  wled: WledDevice;
}
