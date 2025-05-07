import { VModel, VObject } from '@/lib/vails';
import { BpmPlace } from '@/engines/bpm/bpm-core/types/model';

export class BpmPlaceModel extends VModel<BpmPlace> {
  // stateConfig = this.computedAttr('stateConfig', () => {
  //  return BpmPlaceModel.stateMapping()[this.reactiveRecord.state];
  // });

  // static stateMapping(): VObject {
  //   return {
  //     pending: { label: '待提交', color: '#FBBF24' },
  //   };
  // }
}
