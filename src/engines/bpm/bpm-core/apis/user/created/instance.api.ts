import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { Instance } from '../../../types';

export class BpmUserCreatedInstances extends MyApi<Instance> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/user/created',
      name: 'instance',
      actions: [{ method: 'post', name: 'statistic', on: 'collection' }],
      ...config,
    });
  }
}
