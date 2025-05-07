<script lang="ts">
import { ref, defineComponent, toRefs, PropType, computed } from 'vue';
import { PermitUser, PermitRole, PermitUsersRoles } from '@/engines/permit/model';
import { VStore } from '@/lib/vails';
import { PermitAdminRolesApi } from '@/engines/permit/apis/permit/admin/role.api';
import useNestedAttributes from '../../../../components/global/ta-component/ta-template-form-core/useNestedAttributes';
import { VObject } from '@/lib/vails/model';
import { PermitAdminPermissionsApi } from '../../apis/permit/admin/permission.api';
import ComPermitAdminUserRoleDrawer from '../permit/admin/users/ComPermitAdminUserRoleDrawer.vue';

const ComPermitAdminUserRolesIndex = defineComponent({
  name: 'ComPermitAdminUserRolesIndex',
  components: {
    ComPermitAdminUserRoleDrawer,
  },
  props: {
    user: { type: Object as PropType<PermitUser>, required: true },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:user'],
  setup(props, { emit }) {
    const localUser = computed({
      get: () => props.user || { roles_name: [] },
      set: val => emit('update:user', val),
    });

    const usersRolesAttributes = computed({
      get: () => localUser.value.users_roles_attributes,
      set: val => (localUser.value.users_roles_attributes = val),
    });

    const roles2Boolean = computed(() =>
      roleStore.records.value.reduce((out: Record<string, boolean>, role: PermitRole) => {
        out[role.name] = localUser.value.roles_name.includes(role.name);
        return out;
      }, {}),
    );

    const { appendNestedAttributes } = useNestedAttributes();

    const roles = computed({
      get: () => {
        const value = roles2Boolean.value;
        return new Proxy(value, {
          set: (target: Record<string, boolean>, key: string, val: boolean) => {
            const modRolesName = Object.keys(value).filter(name => value[name]);
            const roleId = roleStore.records.value.find(
              (role: PermitRole) => role.name === key,
            )?.id;
            const nestedAttributesPayload: VObject = {
              _id: key,
              role_id: roleId,
              id: localUser.value.users_roles.find(
                (users_role: PermitUsersRoles) => users_role.role_id === roleId,
              )?.id,
            };

            if (val) {
              // 新增
              // 维护 mod_roles_name
              modRolesName.push(key);
              // 维护 roles_name
              localUser.value.roles_name.push(key); // 维护 roles_name
            } else {
              // 删除
              // 维护 mod_roles_name
              const existedIndex = modRolesName.findIndex(name => name === key);
              if (existedIndex > -1) {
                modRolesName.splice(existedIndex, 1);
              }

              // 维护 roles_name
              const rolesNameExistedIndex = localUser.value.roles_name.findIndex(
                (name: string) => name === key,
              );
              if (rolesNameExistedIndex > -1) {
                localUser.value.roles_name.splice(rolesNameExistedIndex, 1);
              }
              // 维护 users_roles_attributes
              nestedAttributesPayload._destroy = true;
            }
            localUser.value.mod_roles_name = modRolesName;
            appendNestedAttributes(nestedAttributesPayload, usersRolesAttributes);
            return true;
          },
        });
      },
      set: () => {},
    });

    const roleStore = new VStore(new PermitAdminRolesApi());

    const permissionStore = new VStore(new PermitAdminPermissionsApi({}));

    const showerPermissions = ref<any[]>([]);

    const premitRef = ref();

    const getPermissions = async () => {
      const res = await permissionStore.index();

      const selectPermissions = res.permissions;
      const all_permissions = res.all_permissions;
      const finalPermissions = all_permissions?.map((el: any) => {
        el.records = el.records.map((v: any) => {
          v.records = v.records.map((s: any) => {
            s.checked = selectPermissions.findIndex((k: any) => k.id === s.id) !== -1;
            return s;
          });
          v.checked = v.records.every((k: any) => k.checked);
          v.indeterminate = v.checked ? false : v.records.some((k: any) => k.checked);
          return v;
        });
        el.checked = el.records.every((k: any) => k.checked);
        el.indeterminate = el.checked ? false : el.records.some((k: any) => k.checked);
        return el;
      });

      const f_filter = [...JSON.parse(JSON.stringify(finalPermissions))].map((el: any) => {
        el.records = el.records.map((s: any) => {
          s.records = s.records.filter((k: any) => k.checked);
          return s;
        });
        return el;
      });
      const s_filter = [...f_filter].map((el: any) => {
        el.records = el.records.filter((s: any) => s.records.length > 0);
        return el;
      });
      showerPermissions.value = [...s_filter].filter((el: any) => el.records.length > 0);
      premitRef.value.visible = true;
    };

    const openDrawer = (record: any) => {
      permissionStore.api.parents = [
        {
          type: 'roles',
          id: record.id,
        },
      ];
      getPermissions();
    };

    const config = computed(() => ({
      recordName: '权限',
      store: roleStore,
      mode: 'table',
      perPage: 999999,
      params: {
        q: {
          ...(props.disabled ? { users_id_eq: props.user.id } : {}),
        },
      },
      pagination: {
        hideOnSinglePage: true,
      },
    }));

    return {
      ...toRefs(props),
      roles,
      config,
      openDrawer,
      showerPermissions,
      premitRef,
    };
  },
});
export default ComPermitAdminUserRolesIndex;
</script>

<template lang="pug">
.com-permit-admin-user-roles-index
  //- | {{ user }}
  TaIndexView(:config='config' @onShow='openDrawer')
    template(#header)
      .empty
    template(#table)
      a-table-column(:autoHeight='true' title='权限', dataIndex='label')
      a-table-column(:autoHeight='true' title='模块名', :dataIndex='["mod_name"]')
      a-table-column(:autoHeight='true' title='')
        template(#default='{ record }')
          a-switch(v-model:checked='roles[record.name]', :disabled='disabled')
  ComPermitAdminUserRoleDrawer(ref='premitRef', :showerPermissions='showerPermissions')
</template>

<style lang="stylus" scoped>
.com-permit-admin-user-roles-index
  width 100%
</style>
