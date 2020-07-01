import { EventEmitter } from "events";
import * as http from "http";
import * as helpers from "./helpers";
import NodeRedNode from "./NodeRedNode";
import INodeConfig from "./types/INodeConfig";
import IWledSegment from "./types/IWledSegment";
import IWledState from "./types/IWLedState";

export default class WledNode extends NodeRedNode {
  constructor(config: INodeConfig) {
    super();
    global.RED.nodes.createNode(this, config);
    // this.wled = new Wled();

    this.on("input", (msg: any, send: any, done: any) => {
      const { payload } = msg;
      const state = {
        on: payload.color ?? (config.state ? Boolean(config.state) : undefined),
        seg: [
          {
            col: [
              payload.color1 ?? helpers.hexToRgb(config.color1),
              payload.color2 ?? helpers.hexToRgb(config.color2),
              payload.color3 ?? helpers.hexToRgb(config.color3)],
            fx: payload.effect ?? Number(config.effect),
            id: 0,
          } as IWledSegment,
        ],
      } as IWledState;

      const body = JSON.stringify(state);

      const options = {
        headers: {
          "Content-Length": Buffer.byteLength(body),
          "Content-Type": "application/json",
        },
        hostname: config.address,
        method: "POST",
        path: "/json/state",
      } as http.RequestOptions;

      http
        .request(options)
        .on("error", console.error)
        .end(body);
    });
  }
}