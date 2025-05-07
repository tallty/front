import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmOperator } from '@/engines/bpm/bpm-core/types/model';

export class BpmAdminOperatorsApi extends MyApi<BpmOperator> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/admin',
      name: 'operator',
      ...config,
    });
  }
}
