import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ComPaperTrailVersion } from '@/engines/com/types/model';

export class ComAdminPaperTrailVersionsApi extends MyApi<ComPaperTrailVersion> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/com/admin',
      name: 'paper_trail_version',
      ...config,
    });
  }
}
