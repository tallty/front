import { MyApi } from '@/apis/MyApi';
import { VApiConfig } from '@/lib/vails/api';
import { BpmMetaRecord } from '../../../types/model';

export class BpmUserMetaRecords extends MyApi<BpmMetaRecord> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/user',
      name: 'meta_record',
      ...config,
    });
  }
}
