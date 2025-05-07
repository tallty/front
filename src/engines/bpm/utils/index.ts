import store from '@/store';

export const personTitle = (targetId: number, name: string): string => {
  const { id } = store.state.user.currentUser;
  if (!targetId) return '系统';
  return targetId === id ? '我' : name;
};
