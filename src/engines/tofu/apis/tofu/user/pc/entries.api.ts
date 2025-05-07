import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { TofuEntry } from '../../../../model';

export class TofuUserPcEntriesApi extends MyApi<TofuEntry> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/tofu/user',
      name: 'entry',
      // 完整路由 /tofu/admin/pc/entries /tofu/admin/modes/1/pc/entries
      pathIndexKey: 'pc/entries',
      actions: [{ name: 'tree', on: 'collection', method: 'get' }],
      ...config,
    });
  }
}
