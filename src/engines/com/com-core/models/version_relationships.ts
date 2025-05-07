import { VModel } from '@/lib/vails';
import { VersionRelationship } from '../types/model';
import dayjs from 'dayjs';

export class VersionRelationshipModel extends VModel<VersionRelationship> {
  createdAtStr = this.computedAttr('createdAtStr', () => {
    return dayjs(this.reactiveRecord.created_at).format('YYYY年MM月DD日 HH:mm');
  });

  actionDesc = this.computedAttr('actionDesc', () => {
    return `${this.reactiveRecord.version?.event} ${this.reactiveRecord.real_resource_type}`;
  });

  changesVisible = this.computedAttr('changesVisible', () => {
    return false;
  });

  extraDesc = this.computedAttr('extraDesc', () => {
    return undefined;
  });
}
