import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmDelayInstance } from '@/engines/bpm/bpm-core/types/model';

export class BpmAdminDelayInstancesApi extends MyApi<BpmDelayInstance> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/admin',
      name: 'delay_instance',
      ...config,
    });
  }
}
