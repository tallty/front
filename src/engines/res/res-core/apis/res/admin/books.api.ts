import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ResBook } from '@/engines/res/res-core/types/model';

export class ResAdminBooksApi extends MyApi<ResBook> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/res/admin',
      name: 'book',
      ...config,
    });
  }
}
