import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
// import { NotifyComment } from '@/engines/notify/types/model';
import { VObject } from '@/lib/vails/model/index';

export class NotifyUserCommentsApi extends MyApi<VObject> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/notify/user',
      name: 'comment',
      ...config,
    });
  }
}
