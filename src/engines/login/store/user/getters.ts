import { GetterTree } from 'vuex';
import { UserState } from './typing';
import { RootState } from '@/store/root-state';

export const getters: GetterTree<UserState, RootState> = {
  currentUser: state => state,
};
