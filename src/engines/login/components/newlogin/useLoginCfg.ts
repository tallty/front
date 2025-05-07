import { UPDATE_SESSION_ID } from '@/engines/login/store/user/actions';
import { VStore } from '@/lib/vails';
import store from '@/store';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { AuthSessionApi } from '../../apis/auth/session.api';
import { SmsAuthRegistApi } from '../../apis/sms_auth/regist_session.api';
import { QrcodeCheckApi, QrcodeCreateApi, QrcodeLoadApi } from '../../apis/wechat/index.api';

export interface User {
  account: string;
  verify_code: string;
  password: string;
  app_id: string;
}

export enum TabKey {
  VERIFY = 'verify',
  PASSWORD = 'password',
  QRCODE = 'qrcode',
}
export interface NewLoginTab {
  name: string;
  key: TabKey;
}

//二次验证
const isNeedVerify = ref(false);
const isNeedVerifyPassword = ref(false);

const convertToCssVariable = (word: string) => {
  let cssVariable = word.replace(/([A-Z])/g, '-$1').toLowerCase();
  cssVariable = '--' + cssVariable;
  return cssVariable;
};

const verifyPassword = (password: string): boolean => {
  const reg =
    /((^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z\W]{8,}$))/;
  if (reg.test(password)) {
    return true;
  }
  return false;
};

const alreadyLogin = (success: () => void) => {
  if (AuthSessionApi.token()) {
    new AuthSessionApi().sendCollectionAction('check').then(() => {
      success();
    });
  }
};

const passwordLogin = async (
  user: User,
  appPromiseFn: (options: any) => Promise<any>,
  success: () => void,
  fn?: (user: User) => void,
) => {
  if (typeof fn === 'function') {
    return fn(user);
  }
  try {
    await new AuthSessionApi({ encrypt: true }).login(user, appPromiseFn).then(res => {
      if (res.status === 201) {
        isNeedVerify.value = res.data?.need_verify;
        isNeedVerifyPassword.value = verifyPassword(user.password);
        if (isNeedVerify.value) {
          return message.warning('请验证手机号');
        }
        return success();
      }
    });
  } catch {}
};

const verifyLogin = async (
  user: User,
  appPromiseFn: (options: any) => Promise<any>,
  success: () => void,
  fn?: (user: User) => void,
) => {
  if (typeof fn === 'function') {
    return fn(user);
  }
  try {
    await new SmsAuthRegistApi().login(user, appPromiseFn);
    return success();
  } catch (error) {
    message.error('登录失败');
  }
};

const qrcodeUtils = (
  user: User,
  type: string,
  appPromiseFn: (...args: any[]) => Promise<any>,
  success: () => void,
) => {
  let timer: any = null;
  let timerCount = 0;
  let ticket = '';
  const openid = ref();
  const img = ref('');

  const CodeStore = new VStore(
    new QrcodeCreateApi({
      parents: [{ type }],
    }),
  );
  const CodeLoadtore = new VStore(
    new QrcodeLoadApi({
      parents: [{ type }],
    }),
  );
  const CodeCheck = new VStore(new QrcodeCheckApi());

  const checkScan = () => {
    return CodeCheck.sendMemberAction({
      id: 1,
      action: 'qrcode_login',
      config: {
        data: {
          ticket,
          app_id: user.app_id,
          wechat_app_id: type,
        },
      },
    })
      .then(res => {
        if (res.data.apps) {
          appPromiseFn(res.data.apps).then(appId => {
            user.app_id = appId;
            checkScan();
          });
        }
        return {
          auth_account: res.data.auth_account,
          oid: res.data.openid,
        };
      })
      .then(({ auth_account, oid }) => {
        if (auth_account || oid) {
          clearQrcodeLogin();
          if (auth_account) {
            new AuthSessionApi().setToken(auth_account.token as string);
            store.dispatch(`user/${UPDATE_SESSION_ID}`, auth_account.id);
            resetQrcode();
            success();
            return;
          }
          if (oid) {
            openid.value = oid;
            clearQrcodeLogin();
          }
        } else {
          clearTimeout(timer);
          checkScanOrQrcodeLogin();
        }
      })
      .catch(e => {
        message.error('二维码登录失败');
        console.log(e);
      });
  };

  const checkScanOrQrcodeLogin = (limit = 60, frequency = 1000) => {
    timer = setTimeout(async () => {
      timerCount++;
      if (timerCount > limit || timerCount === 0) {
        qrcodeLogin();
      } else {
        checkScan();
      }
    }, frequency);
  };

  const qrcodeLogin = async () => {
    openid.value = null;
    await clearQrcodeLogin();
    const codeRes = await CodeStore.sendMemberAction({
      id: 1,
      action: 'qrcode_create_scene',
      config: {
        data: {
          scene_id_or_str: 'login',
          expire_seconds: 60,
        },
      },
    });
    const res = await CodeLoadtore.sendMemberAction({
      id: 1,
      action: 'qrcode_download',
      config: {
        data: {
          ticket: codeRes.data.ticket,
        },
        responseType: 'arraybuffer',
      },
    });
    const str = String.fromCharCode(...new Uint8Array(res.data));
    ticket = codeRes.data.ticket;
    img.value = `data:image/jpeg;base64,${window.btoa(str)}`;
    checkScanOrQrcodeLogin();
  };

  const clearQrcodeLogin = async () => {
    clearTimeout(timer);
    timer = null;
    timerCount = 0;
    return Promise.resolve();
  };

  const resetQrcode = () => {
    openid.value = '';
    img.value = '';
  };

  return {
    openid,
    img,
    qrcodeLogin,
    clearQrcodeLogin,
  };
};

export {
  alreadyLogin,
  convertToCssVariable,
  passwordLogin,
  qrcodeUtils,
  verifyLogin,
  verifyPassword,
};
