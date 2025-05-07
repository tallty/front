import { VStore } from '@/lib/vails';
import { inject } from 'vue';
import { TaCableStoreCenterSubscriptionOptions } from './TaCableStoreCenter';

export const useCable = (
  store: VStore<any>,
  options: TaCableStoreCenterSubscriptionOptions = {},
) => {
  const cable = inject<any>('$cable-store');

  cable.registerStore(store, options);
  return {
    cable,
  };
};
