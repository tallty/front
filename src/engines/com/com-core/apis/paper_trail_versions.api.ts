import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { PaperTrailVersion } from '../types/model';

export class PaperTrailVersionsApi extends MyApi<PaperTrailVersion> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '',
      name: 'paper_trail_version',
      ...config,
    });
  }
}
