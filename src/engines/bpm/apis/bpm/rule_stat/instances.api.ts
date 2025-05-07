import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmInstance } from '@/engines/bpm/types/model';

export class BpmRuleStatInstancesApi extends MyApi<BpmInstance> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/rule_stat',
      name: 'instance',
      ...config,
    });
  }
}
