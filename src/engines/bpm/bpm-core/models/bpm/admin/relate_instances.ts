import { VModel, VObject } from '@/lib/vails';
import { BpmRelateInstance } from '@/engines/bpm/bpm-core/types/model';

export class BpmRelateInstanceModel extends VModel<BpmRelateInstance> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return BpmRelateInstanceModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
