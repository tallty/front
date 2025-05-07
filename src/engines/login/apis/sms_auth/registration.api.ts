import { VApiConfig } from '@/lib/vails/api/index';
import { AuthSession } from '@/engines/login/types/model';
import store from '@/store';
import { CLEAR, SET_FROM_SESSION } from '../../store/user/actions';
import { VObject } from '../../../../lib/vails/model/index';
import { message } from 'ant-design-vue';
import { MyApi } from '@/engines/base/apis/MyApi';

export class SmsAuthRegistrationApi extends MyApi<AuthSession> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/sms_auth/',
      name: 'registration',
      mode: 'single',
      ...config,
    });
  }

  register(info: VObject) {
    return this.create({ ...info })
      .then(async res => {
        await store.dispatch(`user/${SET_FROM_SESSION}`, res.data);
      })
      .catch(err => {
        // message.error(err.response?.data?.message || '注册失败');
        store.dispatch(`user/${CLEAR}`);
        throw err;
      });
  }

  resetPassword(info: VObject) {
    if (info.password_raw !== info.password_raw_check) {
      message.error('两次输入的密码不匹配哦，请检查后再提交');
      return Promise.reject();
    }
    return this.update({ ...info })
      .then(res => {
        // store.dispatch(`user/${SET_FROM_SESSION}`, res.data);
      })
      .catch(err => {
        store.dispatch(`user/${CLEAR}`);
        throw err;
      });
  }
}
export class EmailAuthRegistrationApi extends MyApi<AuthSession> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/mail_auth/',
      name: 'registration',
      mode: 'single',
      ...config,
    });
  }

  register(info: VObject) {
    return this.create({ ...info })
      .then(async res => {
        await store.dispatch(`user/${SET_FROM_SESSION}`, res.data);
      })
      .catch(err => {
        // message.error(err.response?.data?.message || '注册失败');
        store.dispatch(`user/${CLEAR}`);
        throw err;
      });
  }

  resetPassword(info: VObject) {
    if (info.password_raw !== info.password_raw_check) {
      message.error('两次输入的密码不匹配哦，请检查后再提交');
      return Promise.reject();
    }
    return this.update({ ...info })
      .then(res => {
        store.dispatch(`user/${SET_FROM_SESSION}`, res.data);
      })
      .catch(err => {
        store.dispatch(`user/${CLEAR}`);
        throw err;
      });
  }
}
