import { VModel, VObject } from '@/lib/vails';
import { PermitPermitPermission } from '@/engines/permit/types/model';

export class PermitPermitPermissionModel extends VModel<PermitPermitPermission> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return PermitPermitPermissionModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
