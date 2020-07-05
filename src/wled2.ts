/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import discover from "./controllers/discover";
import effects from "./controllers/effects";
import * as helpers from "./helpers";
import INodeMessage from "./types/INodeMessage";
import IWledNodeProperties from "./types/IWledNodeProperties";
import IWledNode from "./types/IWledNode";
import IWledSegment from "./types/IWledSegment";
import IWledState from "./types/IWLedState";
import palettes from "./controllers/palettes";
import { Red } from "node-red";
import WledDevice from "./WledDevice";

export = (RED: Red): void => {
  global.RED = RED;

  RED.httpAdmin.get("/wled2/discover", discover);
  RED.httpAdmin.get("/wled2/effects/:address", effects);
  RED.httpAdmin.get("/wled2/palettes/:address", palettes);
  RED.nodes.registerType("wled2", function(this: IWledNode, props: IWledNodeProperties) {
    this.config = props as IWledNodeProperties;

    RED.nodes.createNode(this, props);

    // When this is loaded for the node palette there's no address
    // so just skip the rest and return silently.
    if (!this.config.address) {
      return;
    }

    this.wled = new WledDevice({ server: this.config.address });

    this.on("input", setState.bind(this));
    this.wled.on("connected", onConnected.bind(this));
    this.wled.on("disconnected", onDisconnected.bind(this));

    this.wled.getState();
  });

  async function setState(msg: INodeMessage): Promise<void> {
    // Any setting of state stops any prior delayed attempt to set the state to solid
    clearTimeout(this.solidTimer);

    const { payload }: { payload: IWledNodeProperties } = msg;

    const delay = payload.delay ?? Number(this.config.delay) ?? 0;

    // The on status is funky. If off is requested and a delay is set the request is really to run
    // the effect for the delayed period and then set off.
    const requestedState = payload.on ?? (this.config.on ? JSON.parse(this.config.on) : undefined);
    const on = delay ? true : requestedState;

    const state = {
      on,
      seg: [
        {
          col: [
            payload.color1 ?? helpers.hexToRgb(this.config.color1),
            payload.color2 ?? helpers.hexToRgb(this.config.color2),
            payload.color3 ?? helpers.hexToRgb(this.config.color3),
          ],
          fx: payload.effect ?? Number(this.config.effect),
          id: 0,
          ix: payload.effectIntensity ?? Number(this.config.effectIntensity),
          pal: payload.palette ?? Number(this.config.palette),
          sx: payload.effectSpeed ?? Number(this.config.effectSpeed),
        } as IWledSegment,
      ],
    } as IWledState;

    await this.wled.setState(state);

    // If a delay was requested flip to solid state after the specified number of seconds.
    if (delay) {
      this.solidTimer = setTimeout(setSolidState.bind(this), delay * 1000, requestedState);
    }

    // Pass the message on
    this.send(msg);
  }

  function setSolidState(on: boolean): void {
    this.wled.setState({
      on,
      seg: [
        {
          fx: 0,
          id: 0,
        },
      ],
    });
  }

  function onConnected() {
    this.status({ fill: "green", shape: "dot", text: `Connected: ${this.config.address}` });
  }

  function onDisconnected() {
    this.status({ fill: "red", shape: "dot", text: "Disconnected" });
  }
};
