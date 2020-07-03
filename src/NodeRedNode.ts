/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export default class NodeRedNode {
  // Stub out the standard NodeRed functions. This comes from
  // https://github.com/yhwang/node-red-contrib-tf-model/blob/master/src/index.ts
  public on: (event: string, fn: (msg: unknown, send: unknown, done: unknown) => void) => void;
  public send: (msg: unknown) => void;
  public status: (option: unknown) => void;
  public log: (msg: string) => void;
  public error: (msg: string) => void;
}
