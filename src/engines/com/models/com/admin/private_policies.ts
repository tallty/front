import { VModel, VObject } from '@/lib/vails';
import { ComPrivatePolicy } from '@/engines/com/types/model';

export class ComPrivatePolicyModel extends VModel<ComPrivatePolicy> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return ComPrivatePolicyModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
