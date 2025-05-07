import { VModel, VObject } from '@/lib/vails';
import { BpmWorkflow } from '@/engines/bpm/types/model';

export class BpmWorkflowModel extends VModel<BpmWorkflow> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return BpmWorkflowModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
