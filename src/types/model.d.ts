export interface Session {
  id: number;
  name?: string;
  code?: string;
  password: string;
  account: string | number;
  app_id: string;
  token?: string;
}

export interface SoaAuthPassword {
  old_password?: string;
  new_password?: string;
  id: number;
}

export interface HomeApp {
  id: number;
  name: string;
  url: string;
  mobile_url?: string;
  type: string;
  icon?: string;
  // image_obj?: import('@/lib/file').IFile[];
  image?: string;
  instance_count?: number;
  subs: HomeApp[];
}
