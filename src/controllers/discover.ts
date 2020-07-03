/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as express from "express";

export default function discover(request: express.Request, response: express.Response): void {
  response.send([
    {
      name: "Test 1",
      address: "192.168.30.14",
    },
    {
      name: "Test 2",
      address: "192.168.30.14",
    },
  ]);
}
