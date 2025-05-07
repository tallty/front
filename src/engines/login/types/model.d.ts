export interface AuthSession {
  id?: number;
  name?: string;
  code?: string;
  password?: string;
  email?: string;
  account?: string | number;
  app_id?: string;
  token?: string;
  verify_code?: string;
  mobile?: string;
  apps?: AuthAppOptions[];
  specify_app_id?: string;
}

export interface AuthAppOptions {
  id: number;
  name: string;
  app_id: string;
}

export interface AuthSoaAuthPassword {
  old_password?: string;
  new_password?: string;
  id: number;
}
export interface SmsAuthUserAccount {
  id: number;
}
export interface SoaSession {
  id: number;
}
