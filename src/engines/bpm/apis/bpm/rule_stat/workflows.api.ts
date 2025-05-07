import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmWorkflow } from '@/engines/bpm/types/model';

export class BpmRuleStatWorkflowsApi extends MyApi<BpmWorkflow> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/rule_stat',
      name: 'workflow',
      ...config,
    });
  }
}
