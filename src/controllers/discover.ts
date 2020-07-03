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
    reuseAddr: true, // in case other mdns service is running
    noInit: true, // do not initialize on creation
  });

  // Listen for responses to the mdns query
  browser.on("response", (response: Response) => {
    // Only look at responses where there's an A record with a single IP address, which is what WLED devices return
    response.additionals
      ?.filter(additional => {
        return additional.type === "A" && typeof additional.data === "string";
      })
      // At this point the additionals were filtered down to A records with a single IP address. Check
      // to see if any of those addresses are a WLED device.
      .map(async additional => {
        try {
          // Attempt to access the known good endpoint for a WLED device
          const response = await fetch(`http://${additional.data}/json`);
          if (!response.ok) {
            return;
          }
          // At this point assume it's a WLED device
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
          name: "_http._tcp.local",
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
