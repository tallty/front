import { VObject } from '../../lib/vails/model/index';

export interface TofuEntry {
  id: number;
  name: string;
  desc: string;
  children: TofuEntry[];
  key: number;
  icon: string;
  url: string;
  title: string;
  depth: number;
  ancestry?: string;
  parent_id: number;
  position: number;
  type: string;
  layout: string;
  permits: VObject;
}

export interface TofuMod {
  id: number;
  name: string;
  key: string;
}
