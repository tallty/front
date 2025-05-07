import { VModel, VObject } from '@/lib/vails';
import { PermitDataScope } from '@/engines/permit/types/model';

export class PermitDataScopeModel extends VModel<PermitDataScope> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return PermitDataScopeModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
