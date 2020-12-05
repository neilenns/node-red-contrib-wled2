/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import IWledNodeProperties from "./IWledNodeProperties";

export default interface INodeMessage {
  payload: IWledNodeProperties;
  state: any;
  topic?: string;
}
