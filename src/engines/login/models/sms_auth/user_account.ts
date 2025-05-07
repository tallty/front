import { VModel, VObject } from '@/lib/vails';
import { SmsAuthUserAccount } from '@/engines/login/types/model';

export class SmsAuthUserAccountModel extends VModel<SmsAuthUserAccount> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return SmsAuthUserAccountModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
