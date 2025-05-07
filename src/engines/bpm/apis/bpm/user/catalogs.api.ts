import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmCatalog } from '@/engines/bpm/types/model';

export class BpmUserCatalogsApi extends MyApi<BpmCatalog> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/user',
      name: 'catalog',
      ...config,
    });
  }
}
