import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ComSearchItem } from '@/engines/com/types/model';

export class ComAdminSearchItemsApi extends MyApi<ComSearchItem> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/com/admin',
      name: 'search_item',
      params: { q: { s: ['position asc'] } },
      ...config,
    });
  }
}
