import { Place } from '../../types';
import { VModel } from '@/lib/vails/model/index';
import dayjs from 'dayjs';

export class PlaceModel extends VModel<Place> {
  createdStr = this.computedAttr('createdStr', () =>
    dayjs(this.reactiveRecord.created_at).format('YYYY/MM/D HH:mm'),
  );

  updatedStr = this.computedAttr('updatedStr', () =>
    dayjs(this.reactiveRecord.updated_at).format('YYYY/MM/D HH:mm'),
  );
}
