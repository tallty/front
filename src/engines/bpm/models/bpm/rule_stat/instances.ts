import { VModel, VObject } from '@/lib/vails';
import { BpmInstance } from '@/engines/bpm/types/model';

export class BpmInstanceModel extends VModel<BpmInstance> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return BpmInstanceModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
