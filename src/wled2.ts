/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import discover from "./controllers/discover";
import effects from "./controllers/effects";
import palettes from "./controllers/palettes";
import WledNode from "./WledNode";
import NodeRed from "./customTypes/nodered";

module.exports = main;

function main(RED: NodeRed) {
  global.RED = RED;

  global.RED.httpAdmin.get("/wled2/discover", discover);
  global.RED.httpAdmin.get("/wled2/effects/:address", effects);
  global.RED.httpAdmin.get("/wled2/palettes/:address", palettes);
  RED.nodes.registerType("wled2", WledNode);
}
