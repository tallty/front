import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { VObject } from '@/lib/vails/model/index';

export class AppsApi extends MyApi<VObject> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '',
      name: 'app',
      ...config,
    });
  }
}
