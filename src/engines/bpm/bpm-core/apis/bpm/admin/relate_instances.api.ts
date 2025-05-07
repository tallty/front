import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmRelateInstance } from '@/engines/bpm/bpm-core/types/model';

export class BpmAdminRelateInstancesApi extends MyApi<BpmRelateInstance> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/admin',
      name: 'relate_instance',
      ...config,
    });
  }
}
