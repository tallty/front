import { VApiConfig } from '@/lib/vails/api/index';
import { VApi } from '@/lib/vails';
import Axios from 'axios';
import qs from 'qs';
import { message } from 'ant-design-vue';
import { VRequestConfig } from '@/lib/vails/request/index';
import localStorage from '@/utils/local-storage';
import { STORAGE_TOKEN_KEY } from '@/store/mutation-type';
import { useSHA256Encrypt } from '@/components/global/ta-component/ta-template-form-core/useSHA256Encrypt';
import { VObject } from '@/lib/vails/model';
import { getLocale } from '@/engines/base/locales';
import { merge } from 'lodash-es';

const { encryptText, decryptText } = useSHA256Encrypt();

const getQueryStringParameter = (href: string, name: string) => {
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(href);
  if (results == null) {
    return '';
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
};

export const createRequestClient = (url?: string, encrypt = false) => {
  const apiUrl = url || process.env.VUE_APP_API_DOMAIN || '';
  const rootPath = process.env.VUE_APP_API_ROOT_PATH || '/';

  const request = Axios.create({
    baseURL: apiUrl + rootPath,
    headers: {
      Accept: 'application/json',
    },
    paramsSerializer(params) {
      return qs.stringify(params, {
        encode: true,
        arrayFormat: 'brackets',
        skipNulls: true,
      });
    },
  });

  request.interceptors.request.use(
    (config: any) => {
      if (!config.headers.authorization) {
        const token = getQueryStringParameter(location.href, 'token');

        Object.assign(config.headers, {
          authorization: `Token ${token || localStorage.get(STORAGE_TOKEN_KEY)}`,
          'Accept-Lang': getLocale(),
        });
      }
      if (
        process.env.NODE_ENV !== 'production' ||
        process.env.VUE_APP_CLOSE_IV_ENCRYPT === 'TRUE'
      ) {
        Object.assign(config.headers, {
          'disable-iv-encrypt': 1,
        });
      }

      if (process.env?.VUE_APP_TENENT_CODE) {
        Object.assign(config.headers, {
          'tanent-code': process.env.VUE_APP_TENENT_CODE,
        });
      }

      if (encrypt) {
        if (Object.keys(config.data || {}).length === 0) {
          const { ivBase64, encryptedText } = encryptText(JSON.stringify(config.params));
          Object.assign(config.headers, {
            'iv-encrypt': true,
            'iv-decode': ivBase64,
          });

          config.params = {
            iv_encrypted: encryptedText,
          };
        } else {
          const { ivBase64, encryptedText } = encryptText(
            JSON.stringify(merge({}, config.params, config.data)),
          );

          Object.assign(config.headers, {
            'iv-encrypt': true,
            'iv-decode': ivBase64,
          });

          config.params = {};
          if (config.data?.constructor === new FormData().constructor) {
            config.data.append('iv_encrypted', encryptedText);
          } else {
            config.data = {
              iv_encrypted: encryptedText,
            };
          }
        }
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  request.interceptors.response.use(
    response => {
      if (encrypt || response.headers['iv-encrypt'] || response.headers['Iv-Encrypt']) {
        const decryptedText = decryptText(response.data.iv_encrypted, response.data.iv64);

        if (decryptedText) {
          const data = JSON.parse(decryptedText);
          if (Array.isArray(data)) {
            response.data = data;
          } else {
            Object.assign(response.data, JSON.parse(decryptedText));
          }
        }
      }
      return response;
    },
    error => {
      if (!error || !error.response) {
        return Promise.reject(error);
      }

      if (encrypt || error.response.headers['iv-encrypt'] || error.response.headers['Iv-Encrypt']) {
        const decryptedText = decryptText(
          error.response.data.iv_encrypted,
          error.response.data.iv64,
        );
        if (decryptedText) Object.assign(error.response.data, JSON.parse(decryptedText));
      }

      const loginPath = process.env.VUE_APP_LOGIN_HREF || '/login';
      const routePath = window.location.pathname;
      switch (error.response.status) {
        case 401:
          if (routePath !== loginPath) {
            window.location.href = `${loginPath}?redirect=${encodeURIComponent(
              routePath.replace(process.env.VUE_APP_PUBLIC_PATH || '', ''),
            )}`;
          }
          break;
        case 500:
          message.error('服务器异常');
          break;
        case 404:
          message.error('资源不存在');
          break;
        case 403:
          message.error('权限不足');
          break;
        case 422:
          message.error(error.response.data.message);
          break;
        default:
          break;
      }
      if (error?.response?.status && process.env.NODE_ENV !== 'production') {
        return Promise.reject({
          errorMessage: String(error),
          response: { ...error.response },
        });
      }
      return Promise.reject(error);
    },
  );

  (request as any).run = (config: VRequestConfig) => {
    return request(config);
  };

  return request;
};

export class MyApi<T extends VObject> extends VApi<T> {
  constructor(config?: VApiConfig) {
    super(config, () => createRequestClient(undefined, config?.encrypt));
  }
}
