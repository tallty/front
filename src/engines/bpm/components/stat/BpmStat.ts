import { VObject } from '@/lib/vails';

export interface StatisticsData {
  name: string;
  icon?: string;
  num: string | number;
  bg?: 'red' | 'green' | 'blue' | 'indigo' | 'gray' | string;
}

export interface BpmTabs {
  label: string;
  key: string;
  store?: VObject;
  params?: VObject;
}
