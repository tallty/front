import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ResTagsRelation } from '@/engines/res/res-core/types/model';

export class ResUserTagsRelationsApi extends MyApi<ResTagsRelation> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/res/user',
      name: 'tags_relation',
      ...config,
    });
  }
}
