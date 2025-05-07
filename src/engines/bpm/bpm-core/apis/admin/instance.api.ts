import { MyApi } from '@/apis/MyApi';
import { VApiConfig } from '@/lib/vails/api';
import { Instance } from '../../types';

export class BpmAdminInstances extends MyApi<Instance> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/admin',
      name: 'instance',
      mode: 'shallow',
      ...config,
      actions: [{ name: 'download_files', method: 'post', on: 'collection' }],
    });
  }
}
