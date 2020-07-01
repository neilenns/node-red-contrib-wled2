import { EventEmitter } from "events";
import * as helpers from "./helpers";
import NodeRedNode from "./NodeRedNode";
import INodeConfig from "./types/INodeConfig";
import IWledSegment from "./types/IWledSegment";
import IWledState from "./types/IWLedState";
import WledDevice from "./WledDevice";

export default class WledNode extends NodeRedNode {
  private wled: WledDevice;
  private config: INodeConfig;

  private solidTimer: NodeJS.Timeout;

  constructor(config: INodeConfig) {
    super();
    global.RED.nodes.createNode(this, config);

    if (!config.address) {
      this.error("No WLED device address specified");
      return;
    }

    this.wled = new WledDevice({ server: config.address });
    this.config = config;

    this.on("input", msg => this.setState(msg));
    this.wled.on("connected", () => this.onConnected());
    this.wled.on("disconnected", () => this.onDisconnected());

    this.wled.getState();
  }

  private setState(msg: any) {
    // Any setting of state stops any prior delayed attempt to set the state to solid
    clearTimeout(this.solidTimer);

    const { payload } = msg;
    const delay = payload.delay ?? Number(this.config.delay) ?? 0;

    const state = {
      on: payload.state ?? (this.config.state ? JSON.parse(this.config.state) : undefined),
      seg: [
        {
          col: [
            payload.color1 ?? helpers.hexToRgb(this.config.color1),
            payload.color2 ?? helpers.hexToRgb(this.config.color2),
            payload.color3 ?? helpers.hexToRgb(this.config.color3),
          ],
          fx: payload.effect ?? Number(this.config.effect),
          id: 0,
          pal: payload.pal ?? Number(this.config.palette)
        } as IWledSegment,
      ],
    } as IWledState;

    this.wled.setState(state);

    // If a delay was requested flip to solid state after the specified number of seconds.
    if (delay) {
      this.solidTimer = setTimeout(this.setSolidState.bind(this), delay * 1000);
    }
  }

  private setSolidState(): void {
    this.wled.setState(
      {
        seg: [
          {
            fx: 0,
            id: 0,
          }
        ]
      })
  }

  private onConnected() {
    this.status({ fill: "green", shape: "dot", text: `Connected: ${this.wled.server}` });
  }

  private onDisconnected() {
    this.status({ fill: "red", shape: "dot", text: "Disconnected" });
  }
}
