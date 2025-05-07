export default {
  login: {
    stte: {
      speech: 'Hi, welcome to STTE',
    },
    type: {
      CODE: 'Quick Login',
      PASSWORD: 'Password Login',
      WECHAT: 'Scan QR Code Login',
      REGISTER: 'Phone Number Registration',
      EMAIL_REGISTER: 'Email Registration',
      FORGET: 'Forgot Password',
    },
    action: {
      CODE: 'Login',
      PASSWORD: 'Login',
      FORGET: 'Reset Password',
      REGISTER: 'Register Now',
      EMAIL_REGISTER: 'Register Now',
    },
    actionText: {
      CODE: "Don't have an account? Click here to register",
      PASSWORD: "Don't have an account? Click here to register",
      WECHAT: "Don't have an account? Click here to register",
      FORGET: 'Already have an account? Click here to log in',
      REGISTER: 'Already have an account? Click here to log in',
      EMAIL_REGISTER: 'Already have an account? Click here to log in',
    },
    placeholder: {
      account: 'Enter your username / mobile / email',
      codeAccount: 'Enter your mobile / email',
      verifyCode: 'Enter verification code',
      password: 'Enter password',
      phone: 'Enter your mobile number',
      mail: 'Enter your email',
      rawPassword: 'Enter new password',
      rawCheckPassword: 'Confirm new password',
      printAccout: 'Please enter the correct account/mobile number/email.',
      checkPrint: 'Please confirm whether the account and password are filled in.',
      printMail: 'Please enter the correct email.',
      verifyPhone: 'Please enter the mobile number.',
      verifyCorrectCode: 'Please enter the correct verification code.',
      verifyPassword:
        'Password length should be at least 8 characters and include a combination of uppercase and lowercase letters, numbers, and special characters.',
    },
    privacy: {
      policy: '《Privacy Policy》',
      agree: 'I have read and agree to the',
      pleaseAgree: 'Please agree to the privacy policy.',
    },
    wechat: {
      scan: 'Open WeChat and scan',
      agree: 'Scanning to log in implies agreement with',
    },
    phone: {
      checkBind:
        'We detected that you have not linked your phone number. Please enter your mobile number to link.',
      onBind: 'Link Mobile Number',
    },
    resetPassword: 'Password reset successful',
    forgotPassword: 'Forgot Password?',
    comGetCode: {
      get: 'Get Verification Code',
      deliver: 'Verification Code Sent',
      second: ' Seconds',
      validator: {
        phone: 'Please enter a valid mobile number',
        mail: 'Please enter a valid email address',
        codeFail: 'Failed to send verification code',
        account: 'Please enter your account',
      },
    },
  },
};
