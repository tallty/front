import { VModel, VObject } from '@/lib/vails';
import { BpmDashboard } from '@/src/bpm-mobile/bpm-core/types/model';

export class BpmDashboardModel extends VModel<BpmDashboard> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return BpmDashboardModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
