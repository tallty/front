import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { Instance } from '../../../types';

export class BpmUserUnreadInstances extends MyApi<Instance> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/user/unread',
      name: 'instance',
      actions: [{ method: 'post', name: 'statistic', on: 'collection' }],
      ...config,
    });
  }
}
