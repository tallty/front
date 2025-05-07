import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmPlace } from '@/engines/bpm/bpm-core/types/model';

export class BpmAdminPlacesApi extends MyApi<BpmPlace> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/admin',
      name: 'place',
      ...config,
    });
  }
}
