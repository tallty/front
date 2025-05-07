import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export type LoginType = 'CODE' | 'PASSWORD' | 'WECHAT' | 'REGISTER' | 'EMAIL_REGISTER' | 'FORGET';

export const LoginTypeMap = computed<Record<LoginType, string>>(() => {
  const { t } = useI18n();

  return {
    CODE: t('login.type.CODE'),
    PASSWORD: t('login.type.PASSWORD'),
    WECHAT: t('login.type.WECHAT'),
    REGISTER: t('login.type.REGISTER'),
    EMAIL_REGISTER: t('login.type.EMAIL_REGISTER'),
    FORGET: t('login.type.FORGET'),
  };
});

export const getTypeName = (v: LoginType) => {
  return LoginTypeMap.value[v];
};

export const actionNameMap = computed<Record<LoginType, string>>(() => {
  const { t } = useI18n();

  return {
    CODE: t('login.action.CODE'),
    PASSWORD: t('login.action.PASSWORD'),
    FORGET: t('login.action.FORGET'),
    REGISTER: t('login.action.REGISTER'),
    EMAIL_REGISTER: t('login.action.EMAIL_REGISTER'),
  } as Record<LoginType, string>;
});

export const getLoginActionName = (v: LoginType): string => {
  return actionNameMap.value[v];
};

const actionTextMap = computed<Record<LoginType, string>>(() => {
  const { t } = useI18n();

  return {
    CODE: t('login.actionText.CODE'),
    PASSWORD: t('login.actionText.PASSWORD'),
    WECHAT: t('login.actionText.WECHAT'),
    FORGET: t('login.actionText.FORGET'),
    REGISTER: t('login.actionText.REGISTER'),
    EMAIL_REGISTER: t('login.actionText.EMAIL_REGISTER'),
  };
});

export const getLoginActionText = (v: LoginType): string => {
  return actionTextMap.value[v];
};
