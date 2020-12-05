/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { EventEmitter } from "events";
import fetch from "node-fetch";
import IWledSegment from "./types/IWledSegment";
import IWledState from "./types/IWLedState";

export default class WledDevice extends EventEmitter {
  public server: string;

  private currentState: IWledState;

  constructor(init?: Partial<WledDevice>) {
    super();
    Object.assign(this, init);
    this.setConnectedState(false);
  }

  /**
   * Gets the current state of the WLED device. If the state was retrieved
   * successfully also sets the device's state to connected.
   * @returns The current state information.
   */
  public async getState(): Promise<void> {
    this.setConnectingState();
    const response = await fetch(`http://${this.server}/json/state`).catch(e => {
      this.setErrorState();
      throw e;
    });

    if (!response.ok) {
      this.setErrorState();
      return;
    }

    try {
      this.currentState = (await response.json()) as IWledState;
    } catch (e) {
      this.setErrorState();
      throw Error(`Unable to get WLED device state: ${e}`);
    }

    // Set the connection status based on the return value.
    if (this.currentState) {
      this.setConnectedState(true);
    } else {
      this.setErrorState();
    }
  }

  /**
   * Gets the current on state for a WLED device. Basically the same
   * as getting the state, but only returning a single property.
   * @returns True if the light is on, false otherwise.
   */
  public async getCurrentOnState(): Promise<boolean> {
    await this.getState().catch(e => {
      throw e;
    });
    return this.currentState.on;
  }

  /**
   * Gets the current on state for a WLED device. Basically the same
   * as getting the state, but only returning a single property.
   * @returns True if the light is on, false otherwise.
   */
  public async getCurrentColorState(): Promise<number[][]> {
    await this.getState().catch(e => {
      throw e;
    });
    try {
      const seg: IWledSegment = this.currentState.seg as IWledSegment;
      return seg.col
    } catch {
      const segs: IWledSegment[] = this.currentState.seg as IWledSegment[]
      return segs[0].col
    }
  }

  /**
   * Sets a WLED device's state
   * @param state The state to send to the WLED device
   */
  public async setState(state: IWledState): Promise<void> {
    try {
      this.setConnectingState();
      const response = await fetch(`http://${this.server}/json/state`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });
      if (!response.ok) {
        this.setErrorState();
        return;
      }
    } catch (e) {
      this.setErrorState();
      throw Error(`Unable to set WLED device state: ${e}`);
    }

    this.setConnectedState(true);
  }

  private setConnectingState() {
    this.emit("connecting");
  }

  private setConnectedState(state: boolean) {
    this.emit(state ? "connected" : "disconnected");
  }

  private setErrorState() {
    this.emit("error");
  }
}
