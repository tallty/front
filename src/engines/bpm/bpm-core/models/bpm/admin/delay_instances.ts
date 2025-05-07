import { VModel, VObject } from '@/lib/vails';
import { BpmDelayInstance } from '@/engines/bpm/bpm-core/types/model';

export class BpmDelayInstanceModel extends VModel<BpmDelayInstance> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return BpmDelayInstanceModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
