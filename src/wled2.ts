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
import * as NodeGlobals from "./nodeGlobals";
import palettes from "./controllers/palettes";
import { Red } from "node-red";
import WledDevice from "./WledDevice";

export = (RED: Red): void => {
  NodeGlobals.setRed(RED);

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
    this.wled.on("connecting", onConnecting.bind(this));
    this.wled.on("disconnected", onDisconnected.bind(this));
    this.wled.on("error", onError.bind(this));

    // On failures the node can just do nothing. Error state
    // will get set automatically by an event fired from the WledDevice object.
    this.wled.getState().catch(e => {
      this.error(`Unable to get state at startup: ${e}`);
      return;
    });
  });

  async function setState(this: IWledNode, msg: INodeMessage): Promise<void> {
    // Any setting of state stops any prior delayed attempt to set the state to solid
    clearTimeout(this.solidTimer);

    const { payload }: { payload: IWledNodeProperties } = msg;

    const delay = payload?.delay ?? Number(this.config.delay) ?? 0;

    // The on status is funky. If off is requested and a delay is set the request is really to run
    // the effect for the delayed period and then set off. Also have to handle toggle state.

    // First off determine if the behaviour for on comes from the payload or the config.
    // This is what the light will ultimately wind up being. True for on, false for off.
    let targetState: boolean;
    // This is what the node was requested to do. It could be "on", "off", "toggle", or
    // undefined. In the undefined case assume "on" is desired so other properties like
    // the effect or colour can be applied.
    const requestedState = payload?.state ?? this.config.state ?? "on";

    // Second step is to get the current state of the light if toggle was requested and
    // set the target state to the opposite of that.
    try {
      if (requestedState.toLowerCase() === "toggle") {
        targetState = !(await this.wled.getCurrentOnState().catch(e => {
          throw Error(`Unable to obtain current device on state to perform toggle: ${e}`);
        }));
      }
      // If toggle wasn't requested the targetState is true if "on" was requested and false
      // for any other value.
      else {
        targetState = requestedState.toLowerCase() === "on";
      }
    } catch (e) {
      // This means the current on state couldn't be retrieved so just give up.
      this.error(e);
      return;
    }

    // If the targetState couldn't be obtained for toggle then bail as failed.
    if (targetState == null) return;

    // Third step is to actually set the on state to what it should be in the initial WLED call, taking into
    // account the delay. If there's a delay the state is always "on" to play the effect before switching to
    // the desired state.
    const on = delay ? true : targetState;

    const state = {
      on,
    } as IWledState;

    // If a preset was set then that overrides everything else
    if (payload?.preset || this.config.preset) {
      state.ps = payload?.preset ?? Number(this.config.preset);
    } else {
      state.bri = payload?.brightness ?? Number(this.config.brightness);

      // Multi-segment support is provided via the incoming payload. If the
      // seg object is specified in the payload then it's what gets used
      // to set the entire segment object. Otherwise the individual
      // properties are set manually.
      if (payload?.seg) {
        state.seg = payload.seg;
      } else {
        state.seg = [{
          id: payload?.segmentId ?? Number(this.config.segmentId),
          on: payload?.state ?? true,
          col: [
            payload?.color1 ?? helpers.hexToRgb(this.config.color1),
            payload?.color2 ?? helpers.hexToRgb(this.config.color2),
            payload?.color3 ?? helpers.hexToRgb(this.config.color3),
          ],
          fx: payload?.effect ?? Number(this.config.effect),
          ix: payload?.effectIntensity ?? Number(this.config.effectIntensity),
          pal: payload?.palette ?? Number(this.config.palette),
          sx: payload?.effectSpeed ?? Number(this.config.effectSpeed),
        } as IWledSegment] ;
      }
    }

    // debug: todo set flag in object for this?
    if(this.config.debug === "on") {
      this.warn(state);
    }  

    // On failures the node can just do nothing. Error state
    // will get set automatically by an event fired from the WledDevice object.
    await this.wled.setState(state).catch(() => {
      return;
    });

    // If a delay was requested flip to solid state after the specified number of seconds.
    if (delay) {
      this.solidTimer = setTimeout(setSolidState.bind(this), delay * 1000, targetState);
    }

    // Pass the message on
    this.send(msg);
  }

  function setSolidState(this: IWledNode, on: boolean): void {
    this.wled
      .setState({
        on,
        seg: [
          {
            fx: Number(this.config.segmentId),
            id: 0,
          },
        ],
      })
      // On failures the node can just do nothing. Error state
      // will get set automatically by an event fired from the WledDevice object.
      .catch(() => {
        return;
      });
  }

  function onConnected(this: IWledNode) {
    this.status({ fill: "green", shape: "dot", text: `Connected to ${this.config.address}` });
  }

  function onConnecting(this: IWledNode) {
    this.status({ fill: "yellow", shape: "dot", text: `Connecting to ${this.config.address}` });
  }

  function onDisconnected(this: IWledNode) {
    this.status({ fill: "red", shape: "dot", text: "Disconnected" });
  }

  function onError(this: IWledNode) {
    this.status({ fill: "red", shape: "dot", text: `Error at ${getPrettyDate()}` });
  }

  function getPrettyDate() {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    });
  }
};
