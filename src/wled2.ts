/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import discover from "./controllers/discover";
import effects from "./controllers/effects";
import INodeConfig from "./types/INodeConfig";
import palettes from "./controllers/palettes";
import NodeRedNode from "./NodeRedNode";
import WledNode from "./WledNode";

import * as Express from "express";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // tslint:disable-next-line: interface-name
    interface Global {
      RED: NodeRed;
    }
  }
}

type NodeRed = {
  nodes: NodeRedNodes;
  httpAdmin: Express.Application;
};

type NodeRedNodes = {
  createNode(node: NodeRedNode, props: INodeConfig): void;
  registerType(type: string, ctor: typeof WledNode): void;
};

module.exports = main;

function main(RED: NodeRed) {
  global.RED = RED;

  global.RED.httpAdmin.get("/wled2/discover", discover);
  global.RED.httpAdmin.get("/wled2/effects/:address", effects);
  global.RED.httpAdmin.get("/wled2/palettes/:address", palettes);
  RED.nodes.registerType("wled2", WledNode);
}
