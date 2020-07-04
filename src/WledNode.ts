/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as helpers from "./helpers";
import NodeRedNode from "./NodeRedNode";
import INodeConfig from "./types/INodeConfig";
import IWledSegment from "./types/IWledSegment";
import IWledState from "./types/IWLedState";
import WledDevice from "./WledDevice";
import INodeRedMessage from "./types/INodeRedMessage";

export default class WledNode extends NodeRedNode {
  private wled: WledDevice;
  private config: INodeConfig;

  private solidTimer: NodeJS.Timeout;

  constructor(config: INodeConfig) {
    super();
    global.RED.nodes.createNode(this, config);

    // When this is loaded for the node palette there's no address
    // so just skip the rest and return silently.
    if (!config.address) {
      return;
    }

    this.wled = new WledDevice({ server: config.address });
    this.config = config;

    this.on("input", (msg: INodeRedMessage) => this.setState(msg));
    this.wled.on("connected", () => this.onConnected());
    this.wled.on("disconnected", () => this.onDisconnected());

    this.wled.getState().catch(e => {
      this.error(e);
      this.onError();
    });
  }

  private async setState(msg: INodeRedMessage): Promise<void> {
    // Any setting of state stops any prior delayed attempt to set the state to solid
    clearTimeout(this.solidTimer);

    const { payload }: { payload: INodeConfig } = msg;

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

    await this.wled.setState(state).catch(e => {
      this.error(e);
      this.onError();
    });

    // If a delay was requested flip to solid state after the specified number of seconds.
    if (delay) {
      this.solidTimer = setTimeout(this.setSolidState.bind(this), delay * 1000, requestedState);
    }

    // Pass the message on
    this.send(msg);
  }

  private async setSolidState(on: boolean): Promise<void> {
    await this.wled
      .setState({
        on,
        seg: [
          {
            fx: 0,
            id: 0,
          },
        ],
      })
      .catch(e => {
        this.error(e);
        this.onError();
      });
  }

  private onConnected() {
    this.status({ fill: "green", shape: "dot", text: `Connected: ${this.wled.server}` });
  }
  private onError() {
    this.status({ fill: "red", shape: "dot", text: `Error` });
  }

  private onDisconnected() {
    this.status({ fill: "red", shape: "dot", text: "Disconnected" });
  }
}
