/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import IWledSegment from "./IWledSegment";

export default interface IWledState {
  on?: boolean;
  effect?: number;
  seg?: IWledSegment[];
}
