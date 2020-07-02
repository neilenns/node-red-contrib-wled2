export default class NodeRedNode {
  // Stub out the standard NodeRed functions. This comes from
  // https://github.com/yhwang/node-red-contrib-tf-model/blob/master/src/index.ts
  public on: (event: string, fn: (msg: any, send: any, done: any) => void) => void;
  public send: (msg: any) => void;
  public status: (option: any) => void;
  public log: (msg: string) => void;
  public error: (msg: string) => void;
}
