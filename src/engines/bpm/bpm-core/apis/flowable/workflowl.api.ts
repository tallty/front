import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { Workflow } from '../../types';

export class BpmFlowableWorkflows extends MyApi<Workflow> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/flowable',
      name: 'workflow',
      ...config,
    });
  }
}
