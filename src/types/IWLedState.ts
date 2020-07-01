import IWledSegment from "./IWledSegment";

export default interface IWledState {
  on?: boolean;
  effect?: number;
  seg?: IWledSegment[];
}