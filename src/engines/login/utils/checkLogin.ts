import { message } from 'ant-design-vue';

export const useCheckLogin = (t: Function) => {
  const checkLogin = (type: string, user: { [p: string]: any }): boolean => {
    if (type === 'CODE') {
      if (!user.account) {
        message.error(t('login.placeholder.printAccout'));
        return false;
      }
      return user.account && validateCode(user.verify_code);
    }

    if (type === 'PASSWORD') {
      if (!user.account || !user.password) {
        message.error(t('login.placeholder.checkPrint'));

        return false;
      }
    }

    if (type === 'REGISTER') {
      return (
        validaPhone(user.account) &&
        validaPassWord(user.password_raw) &&
        validateCode(user.verify_code)
      );
    }

    if (type === 'EMAIL_REGISTER') {
      return validaEmail(user.account) && validateCode(user.verify_code);
    }

    if (type === 'FORGET') {
      return (
        validaPhone(user.account) &&
        validateCode(user.verify_code) &&
        validaPassWord(user.password_raw) &&
        validaPassWord(user.password_raw_check)
      );
    }

    return true;
  };

  const checkEmail = (v: string) => {
    const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    return reg.test(v);
  };
  const checkPhone = (v: string) => {
    const reg = /^1[3456789]\d{9}$/;
    const reg2 = /^0\d{2,3}-?\d{7,8}$/;
    return reg.test(v) || reg2.test(v);
  };

  const checkCode = (v: string) => {
    return v && v.length === 6;
  };

  const checkPass = (v: string) => {
    const reg =
      /((^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,20}$)|(^(?=.*\d)(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,20}$)|(^(?=.*\d)(?=.*[a-z])(?=.*\W)[\da-zA-Z\W]{8,20}$)|(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z\W]{8,}$))/;
    return reg.test(v);
  };

  const validaEmail = (v: string) => {
    if (checkEmail(v)) {
      return true;
    } else {
      message.error(t('login.placeholder.printMail'));
      return false;
    }
  };

  const validaPhone = (v: string) => {
    if (v && checkPhone(v)) {
      return true;
    } else {
      message.error(t('login.placeholder.verifyPhone'));
      return false;
    }
  };

  const validateCode = (v: string) => {
    if (checkCode(v)) {
      return true;
    } else {
      message.error(t('login.placeholder.verifyCorrectCode'));
      return false;
    }
  };

  const validaPassWord = (v: string) => {
    if (checkPass(v)) {
      return true;
    } else {
      message.error(t('login.placeholder.verifyPassword'));
      return false;
    }
  };
  return {
    checkLogin,
  };
};
