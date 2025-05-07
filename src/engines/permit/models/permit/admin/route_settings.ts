import { VModel, VObject } from '@/lib/vails';
import { ComRouteSetting } from '@/engines/permit/model';

export class ComRouteSettingModel extends VModel<ComRouteSetting> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return ComRouteSettingModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
