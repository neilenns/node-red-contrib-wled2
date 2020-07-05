/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Red } from "node-red";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // tslint:disable-next-line: interface-name
    interface Global {
      RED: Red;
    }
  }
}

export {};
