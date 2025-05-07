import { createConsumer } from '@rails/actioncable';
import ls from '@/utils/local-storage';
import { STORAGE_TOKEN_KEY } from '@/store/mutation-type';
import TaCableStoreCenter from './TaCableStoreCenter';

const getWebSocketURL = () => {
  const token = ls.get(STORAGE_TOKEN_KEY);
  return `${process.env.VUE_APP_API_BASE_WSS_URL}?token=${token}`;
};

export const TaCable = {
  install: (app: any, options?: any) => {
    app.config.globalProperties.$cable = new TaCableStoreCenter(
      createConsumer(getWebSocketURL as any),
    );
    app.provide('$cable-store', app.config.globalProperties.$cable);
  },
};
