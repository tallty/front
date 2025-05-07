import { ResUser } from '@/engines/res/res-core/model';

export interface UserState {
  token?: string;
  sessionId?: number;
  currentUser?: Partial<ResUser>;
}
