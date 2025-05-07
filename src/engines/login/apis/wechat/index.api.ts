import { VApiConfig } from '@/lib/vails/api/index';
import { VObject } from '@/lib/vails';
import { MyApi } from '@/engines/base/apis/MyApi';

export class QrcodeCreateApi extends MyApi<VObject> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/weixin',
      name: 'api',
      actions: [{ method: 'post', name: 'qrcode_create_scene', on: 'member' }],
      mode: 'single',
      ...config,
    });
  }
}

export class QrcodeLoadApi extends MyApi<VObject> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/weixin',
      name: 'api',
      actions: [{ method: 'post', name: 'qrcode_download', on: 'member' }],
      mode: 'single',
      ...config,
    });
  }
}

export class QrcodeCheckApi extends MyApi<VObject> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/wechat',
      name: 'login',
      actions: [{ method: 'post', name: 'qrcode_login', on: 'member' }],
      mode: 'single',
      ...config,
    });
  }
}

export class WechatLoginBindApi extends MyApi<VObject> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/soa-auth/user/wechat',
      name: 'bind',
      mode: 'single',
      wrapParams: false,
      ...config,
    });
  }
}
