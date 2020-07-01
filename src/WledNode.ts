import { EventEmitter } from "events";
import * as helpers from "./helpers";
import NodeRedNode from "./NodeRedNode";
import INodeConfig from "./types/INodeConfig";
import IWledSegment from "./types/IWledSegment";
import IWledState from "./types/IWLedState";
import WledDevice from "./WledDevice";

export default class WledNode extends NodeRedNode {
  private _wled: WledDevice;
  private _config: INodeConfig;

  private setState(msg: any, send: any, done: any) {
    const { payload } = msg;
    const state = {
      on: payload.color ?? (this._config.state ? Boolean(this._config.state) : undefined),
      seg: [
        {
          col: [
            payload.color1 ?? helpers.hexToRgb(this._config.color1),
            payload.color2 ?? helpers.hexToRgb(this._config.color2),
            payload.color3 ?? helpers.hexToRgb(this._config.color3),
          ],
          fx: payload.effect ?? Number(this._config.effect),
          id: 0,
        } as IWledSegment,
      ],
    } as IWledState;

    this._wled.setState(state);
  }

  constructor(config: INodeConfig) {
    super();
    global.RED.nodes.createNode(this, config);
    this._wled = new WledDevice({ server: config.address });
    this._config = config;

    this.on("input", (msg: any, send: any, done: any) => this.setState(msg, send, done));
  }
}
