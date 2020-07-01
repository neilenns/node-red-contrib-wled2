// import * as request from "request-promise-native";
import * as http from "http";
import IWledSegment from "./types/IWledSegment";
import IWledState from "./types/IWLedState";

module.exports = main;

let _RED: any;

function Wled2Node(config: any) {
  _RED.nodes.createNode(this, config);
  const node = this;
  node.on('input', (msg: any) => {
    const state = {
      on: true,
      seg: [
        {
          col: [
            [0, 255, 0]
          ],
          fx: msg.payload?.effect ?? Number(config.effect),
          id: 0,
        } as IWledSegment
      ]
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

    http.request(options).on("error", console.error).end(body);
  });

}

function main(RED: any) {
  _RED = RED;
  _RED.nodes.registerType("wled2", Wled2Node);
}
