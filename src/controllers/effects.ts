/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as express from "express";
import fetch from "node-fetch";
import defaultEffects from "../defaults/effects.json";
import IWledEffect from "../types/IWledEffect";
import { RED } from "../nodeGlobals";

// Queries a WLED device for its list of effects.
export default async function effects(request: express.Request, response: express.Response): Promise<void> {
  if (!request.params.address) {
    RED.log.warn("wled2: No address specified to retrieve effects list. Falling back to defaults.");
    response.json(defaultEffects);
    return;
  }

  try {
    const result = await fetch(`http://${request.params.address}/json/effects`);
    if (!result.ok) {
      response.json(defaultEffects);
      return;
    }

    // Get all the effects
    const rawEffects = (await result.json()) as string[];

    // Convert to the format required for the response
    response.json(
      rawEffects.map((name: string, id: number) => {
        return { id, name } as IWledEffect;
      }),
    );

    return;
  } catch (e) {
    RED.log.warn(`wled2: Unable to load effects: ${e}. Falling back to defaults.`);
    response.json(defaultEffects);
    return;
  }
}
