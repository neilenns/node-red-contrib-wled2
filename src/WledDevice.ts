/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { EventEmitter } from "events";
import fetch from "node-fetch";
import IWledState from "./types/IWLedState";

export default class WledDevice extends EventEmitter {
  public server: string;

  private isConnected: boolean;
  private currentState: IWledState;

  constructor(init?: Partial<WledDevice>) {
    super();
    Object.assign(this, init);
    this.setConnectionState(false);
  }

  /**
   * Gets the current state of the WLED device. If the state was retrieved
   * successfully also sets the device's state to connected.
   * @returns The current state information.
   */
  public async getState(): Promise<void> {
    const response = await fetch(`http://${this.server}/json/state`);
    if (!response.ok) {
      this.setConnectionState(false);
      return;
    }

    try {
      this.currentState = (await response.json()) as IWledState;
    } catch (e) {
      this.setConnectionState(false);
      throw Error(`Unable to get WLED device state: ${e}`);
    }

    // Set the connection status based on the return value.
    if (this.currentState) {
      this.setConnectionState(true);
    } else {
      this.setConnectionState(false);
    }
  }

  /**
   * Sets a WLED device's state
   * @param state The state to send to the WLED device
   */
  public async setState(state: IWledState): Promise<void> {
    try {
      const response = await fetch(`http://${this.server}/json/state`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });
      if (!response.ok) {
        this.setConnectionState(false);
        return;
      }
    } catch (e) {
      this.setConnectionState(false);
      throw Error(`Unable to set WLED device state: ${e}`);
    }

    this.setConnectionState(true);
  }

  private setConnectionState(state: boolean) {
    if (this.isConnected !== state) {
      this.isConnected = state;
    }
    this.emit(this.isConnected ? "connected" : "disconnected");
  }
}
