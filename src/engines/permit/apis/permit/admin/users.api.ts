import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { PermitUser } from '@/engines/permit/model';
import { VModel } from '../../../../../lib/vails/model/index';

export class PermitAdminUsersApi extends MyApi<PermitUser> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/permit/admin',
      name: 'user',
      ...config,
    });
  }
}

export class PermitAdminUserModel extends VModel<PermitUser> {
  rolesMapProxy = new Proxy(this.reactiveRecord, {
    // 数据结构为:
    // {
    //   permit: {
    //     permit_admin: false,
    //     permit_operate: false,
    //     permit_view: false,
    //     permit_none: false,
    //   }
    // }
    get: (user: PermitUser, modKeyAndId: string) => {
      if (typeof modKeyAndId !== 'string') return;
      const [modKey, modId] = modKeyAndId.split('@');

      // set 返回 modKeyAndId + key 取到的返回值，
      // get 改变 handler，在开关改变时发起请求
      return new Proxy(
        {},
        {
          get: (_: any, rolePermit: string) => {
            return typeof rolePermit === 'string'
              ? !!user.roles.find(role => role.name === rolePermit)
              : false;
          },
          set: (_: any, rolePermit: string, switchValue: any) => {
            const roleStrAry = user.roles
              .map(role => role.name)
              .filter((roleStr: string) => roleStr.startsWith(modKey));
            if (switchValue) {
              roleStrAry.push(rolePermit);
            } else {
              const index = roleStrAry.findIndex((str: string) => str === rolePermit);
              if (index !== -1) roleStrAry.splice(index, 1);
            }
            try {
              this.update({ mod_id: modId, mod_roles_name: roleStrAry });
              return true;
            } catch {
              return false;
            }
          },
        },
      );
    },
  });
}
