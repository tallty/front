import { VModel, VObject } from '@/lib/vails';
import { ComApp } from '@/engines/com/types/model';

export class ComAppModel extends VModel<ComApp> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return ComAppModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
