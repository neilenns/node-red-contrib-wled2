import WledNode from "./WledNode";

declare global {
  namespace NodeJS {
    // tslint:disable-next-line: interface-name
    interface Global {
      RED: any;
    }
  }
}
module.exports = main;

function main(RED: any) {
  global.RED = RED;
  RED.nodes.registerType("wled2", WledNode);
}
