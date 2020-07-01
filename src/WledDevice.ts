import { EventEmitter } from "events";
import * as http from "http";
import IWledState from "./types/IWLedState";

export default class WledDevice extends EventEmitter {
  public server: string;

  constructor(init?: Partial<WledDevice>) {
    super();
    Object.assign(this, init);
  }

  /**
   * Sets a WLED device's state
   * @param state The state to send to the WLED device
   */
  public setState(state: IWledState): void {
    const body = JSON.stringify(state);

    const options = {
      headers: {
        "Content-Length": Buffer.byteLength(body),
        "Content-Type": "application/json",
      },
      hostname: this.server,
      method: "POST",
      path: "/json/state",
    } as http.RequestOptions;

    http
      .request(options)
      .on("error", console.error)
      .end(body);
  }
}
