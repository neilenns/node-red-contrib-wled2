/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Neil Enns. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as Express from "express";

export default interface NodeRed {
  nodes: NodeRedNodes;
  httpAdmin: Express.Application;
  log: NodeRedLogger;
}

export interface NodeRedLogger {
  debug: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  log: (message: string) => void;
  warn: (message: string) => void;
}

export interface NodeRedNodes {
  createNode(node: NodeRedNode, props: unknown): void;
  registerType(type: string, ctor: unknown): void;
}

export interface NodeRedNode {
  on: (event: string, fn: (msg: unknown, send: unknown, done: unknown) => void) => void;
  send: (msg: unknown) => void;
  status: (option: unknown) => void;
  log: (msg: string) => void;
  error: (msg: string) => void;
}
