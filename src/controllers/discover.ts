/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as express from "express";
import fetch from "node-fetch";
import IWledDevice from "../types/IWledDevice";
import IWledDiscoveredDevice from "../types/IWledDiscoveredDevice";
import mdns from "mdns-server";

const timeout = 4000;

interface Answer {
  name: string;
  type: string;
  class: number;
  ttl: number;
  flush: boolean;
  data: string;
}

interface Response {
  id: number;
  additionals: Answer[];
}

export default async function discover(request: express.Request, response: express.Response): Promise<void> {
  const wledDevices: IWledDevice[] = [];

  const browser = new mdns({
    reuseAddr: true, // In case another mdns service is running
    noInit: true, // Will init after everything is configured
  });

  // Listen for responses to the mdns query
  browser.on("response", (response: Response) => {
    // Only look at the A record
    response.additionals
      ?.filter(additional => {
        return additional.type === "A";
      })
      // At this point the additionals were filtered down to just A records
      .map(async additional => {
        try {
          // Attempt to access the known good endpoint for a WLED device to get the device name.
          // This also confirms it is a WLED device since other random devices will sometimes
          // respond to the request even though the query was for _wled (e.g. some Tasmota
          // bulbs seem to do this).
          const response = await fetch(`http://${additional.data}/json`);
          if (!response.ok) {
            return;
          }

          const device = (await response.json()) as IWledDiscoveredDevice;
          const wledDevice = {
            name: device.info.name,
            address: additional.data,
            version: device.info.version,
          };

          console.log(`Found a WLED device: ${JSON.stringify(wledDevice)}`);
          wledDevices.push(wledDevice);
        } catch (e) {
          console.log(e);
        }
      });
  });

  // Query for http services
  browser.on("ready", function() {
    browser.query({
      questions: [
        {
          name: "_wled._tcp.local",
          type: "PTR",
        },
      ],
    });
  });

  // initialize the server now that we are watching for events
  browser.initServer();

  // After the discovery is complete respond with the results
  setTimeout(() => {
    browser.destroy();
    response.json(wledDevices);
  }, timeout);
}
