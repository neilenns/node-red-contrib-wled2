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
    console.log(this.config)
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

  function which(val1: any, val2: any): any {
    return val1 ? val1 : val2 ? val2 : undefined;
  }

  function getMergedPayloadAndConfig(payload: IWledNodeProperties, config: IWledNodeProperties): IWledNodeProperties {
    const mergedProperties = {
      name: "N/A"
    } as IWledNodeProperties
    mergedProperties.address = which(payload.address, config.address)
    mergedProperties.brightness = which(payload.brightness, payload.brightness);
    mergedProperties.color1 = which(payload.color1, config.color1)
    mergedProperties.color2 = which(payload.color2, config.color2)
    mergedProperties.color3 = which(payload.color3, config.color3)
    mergedProperties.delay = which(payload.delay, config.delay)
    mergedProperties.effect = which(payload.effect, config.effect)
    mergedProperties.effectIntensity = which(payload.effectIntensity, config.effectIntensity)
    mergedProperties.effectSpeed = which(payload.effectSpeed, config.effectSpeed)
    mergedProperties.palette = which(payload.palette, config.palette)
    mergedProperties.preset = which(payload.preset, config.preset)
    mergedProperties.state = which(payload.state, config.state)
    mergedProperties.seg = which(payload.seg, config.seg)
    return mergedProperties
  }

  function convertPayloadToState(payload: IWledNodeProperties): IWledState {
    const state = {} as IWledState;

    // If a preset was set then that overrides everything else
    if (payload.preset) {
      state.ps = payload.preset;
    } else {
      if (payload.brightness) {
        state.bri = payload.brightness;
      }

      // Multi-segment support is provided via the incoming payload. If the
      // seg object is specified in the payload then it's what gets used
      // to set the entire segment object. Otherwise the individual
      // properties are set manually.
      if (payload.seg) {
        state.seg = payload.seg;
      } else {
        const seg = {} as IWledSegment
        if (payload.color1 || payload.color2 || payload.color3) {
          const col = [];
          if (payload.color1) {
            col.push(helpers.hexToRgb(payload.color1))
          }
          if (payload.color2) {
            col.push(helpers.hexToRgb(payload.color2))
          }
          if (payload.color3) {
            col.push(helpers.hexToRgb(payload.color3))
          }
          seg.col = col
        }

        if (payload.effect) {
          seg.fx = payload.effect
        }

        if (payload.effectIntensity) {
          seg.ix = payload.effectIntensity
        }

        if (payload.palette) {
          seg.pal = payload.palette
        }

        if (payload.effectSpeed) {
          seg.sx = payload.effectSpeed
        }
        state.seg = seg;
      }
    }
    return state
  }

  async function setState(this: IWledNode, msg: INodeMessage): Promise<void> {
    // Any setting of state stops any prior delayed attempt to set the state to solid
    clearTimeout(this.solidTimer);

    const { payload }: { payload: IWledNodeProperties } = msg;

    const mergedPayload = getMergedPayloadAndConfig(payload || {} as IWledNodeProperties, this.config);

    const delay = mergedPayload.delay ?? 0;

    // The on status is funky. If off is requested and a delay is set the request is really to run
    // the effect for the delayed period and then set off. Also have to handle toggle state.

    // First off determine if the behaviour for on comes from the payload or the config.
    // This is what the light will ultimately wind up being. True for on, false for off.
    let targetState: boolean;
    // This is what the node was requested to do. It could be "on", "off", "toggle", or
    // undefined. In the undefined case assume "on" is desired so other properties like
    // the effect or colour can be applied.
    const requestedState = mergedPayload.state;

    // Second step is to get the current state of the light if toggle was requested and
    // set the target state to the opposite of that.
    try {
      if (requestedState) {
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
      }
    } catch (e) {
      // This means the current on state couldn't be retrieved so just give up.
      this.error(e);
      return;
    }

    // If we requested a state, and the targetState couldn't be obtained for toggle then bail as failed.
    if (requestedState && targetState == null) return;

    // Third step is to actually set the on state to what it should be in the initial WLED call, taking into
    // account the delay. If there's a delay the state is always "on" to play the effect before switching to
    // the desired state. If there isn't a delay, check to see if we have a requestedState. If we do, we have a target state.
    // If we don't, we don't want to send this param. 
    const on = delay ? true : requestedState ? targetState : undefined;
    const state = convertPayloadToState(mergedPayload)
    if (on !== undefined) {
      state.on = on
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
            fx: 0,
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
