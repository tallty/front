import { VModel, VObject } from '@/lib/vails';
import { SoaSession } from '@/engines/login/types/model';

export class SoaSessionModel extends VModel<SoaSession> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return SoaSessionModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
