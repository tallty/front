export interface PermitUser {
  id: number;
  name: string;
  mod_id?: string;
  mod_roles_name?: string[];
  roles_name: string[];
  roles: PermitRole[];
  users_roles: PermitUsersRoles[];
  users_roles_attributes: (PermitUsersRoles & { _destroy: boolean })[];
}

export interface PermitMod {
  id: number;
  name: string;
  key: string;
}

export interface PermitRole {
  id: number;
  label: string;
  mod: PermitMod;
  mod_id: number;
  name: string;
  resource_id?: number;
  resource_type?: string;
  updated_at: string;
  created_at: string;
  user_ids: number[];
}

export interface PermitUsersRoles {
  id: number;
  user_id: number;
  role_id: number;
}

export interface ComRouteSetting {
  id: number;
}
