import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { Instance } from '../../types';

export class BpmFlowableInstances extends MyApi<Instance> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/flowable',
      name: 'instance',
      ...config,
    });
  }
}
