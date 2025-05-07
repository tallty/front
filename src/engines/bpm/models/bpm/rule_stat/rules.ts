import { VModel, VObject } from '@/lib/vails';
import { BpmRule } from '@/engines/bpm/types/model';

export class BpmRuleModel extends VModel<BpmRule> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return BpmRuleModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
