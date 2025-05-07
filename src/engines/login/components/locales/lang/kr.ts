export default {
  login: {
    stte: {
      speech: '안녕하세요, STTE에 오신 것을 환영합니다',
    },
    type: {
      CODE: '빠른 로그인',
      PASSWORD: '비밀번호 로그인',
      WECHAT: 'QR 코드 스캔 로그인',
      REGISTER: '전화 번호 등록',
      EMAIL_REGISTER: '이메일 등록',
      FORGET: '비밀번호 잊어버림',
    },
    action: {
      CODE: '로그인',
      PASSWORD: '로그인',
      FORGET: '비밀번호 재설정',
      REGISTER: '지금 등록',
      EMAIL_REGISTER: '지금 등록',
    },
    actionText: {
      CODE: '계정이 없으신가요? 여기를 클릭하여 등록하세요',
      PASSWORD: '계정이 없으신가요? 여기를 클릭하여 등록하세요',
      WECHAT: '계정이 없으신가요? 여기를 클릭하여 등록하세요',
      FORGET: '이미 계정이 있으신가요? 여기를 클릭하여 로그인하세요',
      REGISTER: '이미 계정이 있으신가요? 여기를 클릭하여 로그인하세요',
      EMAIL_REGISTER: '이미 계정이 있으신가요? 여기를 클릭하여 로그인하세요',
    },
    placeholder: {
      account: '사용자 이름 / 휴대폰 / 이메일을 입력하세요',
      codeAccount: '사용자 휴대폰 / 이메일을 입력하세요',
      verifyCode: '인증 코드를 입력하세요',
      password: '비밀번호를 입력하세요',
      phone: '휴대폰 번호를 입력하세요',
      mail: '이메일 주소를 입력하세요',
      rawPassword: '새 비밀번호를 입력하세요',
      rawCheckPassword: '새 비밀번호를 확인하세요',
      printAccout: '올바른 계정/휴대폰 번호/이메일을 입력하세요.',
      checkPrint: '계정과 비밀번호가 입력되었는지 확인하세요.',
      printMail: '올바른 이메일을 입력하세요.',
      verifyPhone: '휴대폰 번호를 입력하세요.',
      verifyCorrectCode: '올바른 인증 코드를 입력하세요.',
      verifyPassword:
        '비밀번호 길이는 최소 8자 이상이어야 하며 대문자, 소문자, 숫자, 특수 문자를 세 가지 이상의 조합으로 포함해야 합니다.',
    },
    privacy: {
      policy: '《개인정보 보호 정책》',
      agree: '내용을 읽고 동의합니다',
      pleaseAgree: '개인정보 보호 정책에 동의해주세요.',
    },
    wechat: {
      scan: 'WeChat을 열고 스캔하세요',
      agree: '스캔하여 로그인하는 것은 다음과 동의하는 것을 의미합니다',
    },
    phone: {
      checkBind:
        '휴대폰 번호를 연결하지 않았음을 감지했습니다. 연결하려면 휴대폰 번호를 입력하세요.',
      onBind: '휴대폰 번호 연결',
    },
    resetPassword: '비밀번호 재설정 완료',
    forgotPassword: '비밀번호를 잊어버렸나요?',
    comGetCode: {
      get: '인증 코드 받기',
      deliver: '인증 코드가 전송되었습니다',
      second: ' 초',
      validator: {
        phone: '유효한 휴대폰 번호를 입력하세요',
        mail: '유효한 이메일 주소를 입력하세요',
        codeFail: '인증 코드 전송 실패',
        account: '계정을 입력하세요',
      },
    },
  },
};
