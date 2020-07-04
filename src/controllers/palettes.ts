/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as express from "express";
import fetch from "node-fetch";
import defaultPalettes from "../defaults/palettes.json";
import IWledPalette from "../types/IWledPalette";

// Queries a WLED device for its list of palettes.
export default async function palettes(request: express.Request, response: express.Response): Promise<void> {
  if (!request.params.address) {
    console.log("wled2: No address specified to retrieve palette list. Falling back to defaults.");
    response.json(defaultPalettes);
  }

  try {
    const result = await fetch(`http://${request.params.address}/json/palettes`);
    if (!result.ok) {
      response.json(defaultPalettes);
      return;
    }

    // Get all the palettes
    const rawPalettes = (await result.json()) as string[];
    const palettes: IWledPalette[] = [];
    let paletteId = 0;
    rawPalettes.map(paletteName => {
      palettes.push({ id: paletteId++, name: paletteName });
    });

    response.json(palettes);
  } catch (e) {
    console.log(`wled2: Unable to load palettes: ${e}. Falling back to defaults.`);
    response.json(defaultPalettes);
  }
}
