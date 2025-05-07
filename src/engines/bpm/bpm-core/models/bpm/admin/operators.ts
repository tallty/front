import { VModel, VObject } from '@/lib/vails';
import { BpmOperator } from '@/engines/bpm/bpm-core/types/model';

export class BpmOperatorModel extends VModel<BpmOperator> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return BpmOperatorModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
