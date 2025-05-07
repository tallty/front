<template lang="pug">
.h-0.flex-grow.flex.flex-col.w-full 
  .flex.items-center.justify-between.pb-4
    .text-gray-500.text-sm 设置角色对应的功能操作、应用管理、后台管理权限
    .flex.flex-row.items-center
     
      a-button(@click='selectedAll' v-show='!disabled') 全选
      a-button(@click='clearSelect' style='margin-left: 12px' v-show='!disabled') 清空
      a-button(@click='openSelectedPermissions' style='margin-left: 24px') 查看全部
  .w-full.flex.flex-row.box-border.border-1.border-gray-100.bb-none.rounded-t-lg
    .w-34.h-11.px-4.py-3.box-border.rounded-tl-lg.bg-gray-100.bb-w.flex.items-center.justify-center.text-sm.font-medium.text-gray-900 模块
    .w-44.h-11.px-4.py-3.box-border.bg-gray-50.flex.items-center.justify-center.bb-w.text-sm.font-medium.text-gray-900 权限包
    .w-0.h-11.flex-grow.px-4.py-3.box-border.bb-g.text-sm.font-medium.text-gray-900.flex.items-center.justify-center 方法
  .h-0.flex-grow.overflow-y-scroll.w-full.border-1.border-gray-100.rounded-b-lg.bt-none.flex.flex-col 
    .flex.flex-row.items-center(v-for='item in finalPermissions')
      .w-34.px-4.py-3.box-border.bg-gray-100.bb-w.flex.items-center.justify-center.text-sm.font-medium.text-gray-900.h-full
        a-checkbox(:checked='item.checked' :value='item.mod' @change='change_first_item' :indeterminate='item.indeterminate' :disabled='disabled')  {{ item.name }}
      .w-0.flex-grow.flex.flex-row.flex-col 
        .w-full.flex.flex-col(v-for='s_item in item.records')
          .w-full.flex.flex-row
            .w-44.px-4.py-3.box-border.bg-gray-50.flex.items-center.justify-start.bb-w.text-sm.font-medium.text-gray-900.flex.flex-row.flex-wrap.break-all
              a-checkbox(:checked='s_item.checked' @change='change_sub_item' :value='s_item.klass' :indeterminate='s_item.indeterminate' :disabled='disabled') {{ s_item.name }}
            .w-0.flex-grow.flex.flex-wrap.box-border.bb-g.pb-4 
              .mx-4.mt-4( v-for='t_item in s_item.records')
                a-checkbox(:checked='t_item.checked' @change='changeItem' :value='t_item.key' :disabled='disabled') {{ t_item.aname }}
  ComPermitAdminUserRoleDrawer(ref='premitRef', :showerPermissions='showerPermissions')
</template>
<script lang="ts">
import { PermitAdminPermissionsApi } from '@/engines/permit/apis/permit/admin/permission.api';
import { VStore } from '@/lib/vails';
import { defineComponent, ref, toRefs, watch } from 'vue';
import ComPermitAdminUserRoleDrawer from './ComPermitAdminUserRoleDrawer.vue';

const ComPermitAdminUserRole = defineComponent({
  name: 'ComPermitAdminUserRole',
  components: {
    ComPermitAdminUserRoleDrawer,
  },
  props: {
    activeRole: { type: Object, default: () => {} },
    disabled: { type: Boolean, default: () => false },
  },
  emits: ['reset'],
  setup(props, { emit }) {
    const store = new VStore(new PermitAdminPermissionsApi({}));
    const all_permissions = ref<any[]>([]);
    const selectPermissions = ref<any[]>([]);
    const finalPermissions = ref<any[]>([]);
    const showerPermissions = ref<any[]>([]);
    const record = ref<any>();
    const getPermissions = async () => {
      const res = await store.index();

      record.value = res;
      selectPermissions.value = res.permissions;
      all_permissions.value = res.all_permissions;
      finalPermissions.value = all_permissions.value?.map((el: any) => {
        el.records = el.records.map((v: any) => {
          v.records = v.records.map((s: any) => {
            s.checked = selectPermissions.value.findIndex((k: any) => k.key === s.key) !== -1;
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
    };
    watch(
      () => props.activeRole,
      () => {
        if (props.activeRole?.id) {
          store.api.parents = [
            {
              type: 'roles',
              id: props.activeRole.id,
            },
          ];
          getPermissions();
        }
      },
      {
        deep: true,
        immediate: true,
      },
    );
    const changeItem = (e: any) => {
      finalPermissions.value = finalPermissions.value?.map((el: any) => {
        el.records = el.records.map((v: any) => {
          v.records = v.records.map((s: any) => {
            s.checked = s.key === e.target.value ? e.target.checked : s.checked;
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
    };

    const change_sub_item = (e: any) => {
      finalPermissions.value = finalPermissions.value?.map((el: any) => {
        el.records = el.records.map((v: any) => {
          const isHack = e.target.value === v.klass;
          v.checked = isHack ? e.target.checked : v.checked;
          v.indeterminate = false;
          v.records = v.records.map((s: any) => {
            s.checked = isHack ? e.target.checked : s.checked;
            return s;
          });
          return v;
        });
        el.checked = el.records.every((k: any) => k.checked);
        el.indeterminate = el.checked ? false : el.records.some((k: any) => k.checked);
        return el;
      });
    };
    const change_first_item = (e: any) => {
      finalPermissions.value = finalPermissions.value?.map((el: any) => {
        const isHack = e.target.value === el.mod;
        el.checked = isHack ? e.target.checked : el.checked;
        el.indeterminate = false;
        el.records = el.records.map((v: any) => {
          v.checked = isHack ? e.target.checked : v.checked;
          v.indeterminate = false;
          v.records = v.records.map((s: any) => {
            s.checked = isHack ? e.target.checked : s.checked;
            return s;
          });
          return v;
        });

        return el;
      });
    };

    const restPermission = () => {
      getPermissions();
    };

    const save = () => {
      const keys: any[] = [];
      finalPermissions.value.forEach((el: any) => {
        el.records.forEach((v: any) => {
          v.records.forEach((s: any) => {
            if (s.checked) {
              keys.push(s.key);
            }
          });
        });
      });
      emit('reset', keys);
    };

    const premitRef = ref();
    const openSelectedPermissions = () => {
      const f_filter = [...JSON.parse(JSON.stringify(finalPermissions.value))].map((el: any) => {
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

    const selectedAll = () => {
      finalPermissions.value = finalPermissions.value?.map((el: any) => {
        el.checked = true;
        el.indeterminate = false;
        el.records = el.records.map((v: any) => {
          v.checked = true;
          v.indeterminate = false;
          v.records = v.records.map((s: any) => {
            s.checked = true;
            return s;
          });
          return v;
        });

        return el;
      });
    };
    const clearSelect = () => {
      finalPermissions.value = finalPermissions.value?.map((el: any) => {
        el.checked = false;
        el.indeterminate = false;
        el.records = el.records.map((v: any) => {
          v.checked = false;
          v.indeterminate = false;
          v.records = v.records.map((s: any) => {
            s.checked = false;
            return s;
          });
          return v;
        });

        return el;
      });
    };
    return {
      ...toRefs(props),
      record,
      finalPermissions,
      changeItem,
      change_sub_item,
      change_first_item,
      restPermission,
      save,

      showerPermissions,
      openSelectedPermissions,

      selectedAll,
      clearSelect,

      premitRef,
    };
  },
});
export default ComPermitAdminUserRole;
</script>
<style lang="stylus" scoped>
.bb-w
  border-bottom 1px solid white
.bb-g
  border-bottom 1px solid #F3F4F6
.bb-none
  border-bottom none !important
.bt-none
  border-top none !important
>>>.ant-checkbox-inner
  border: 0.5px solid  #D1D5DB;
  background: #F9FAFB
>>>.ant-checkbox-checked
  .ant-checkbox-inner
    border-color: $primary-color;
    background: $primary-color;
>>>.ant-checkbox-wrapper
  span
    color #111928
>>>.ant-checkbox-disabled
  .ant-checkbox-inner
    background-color #f5f5f5 !important
  .ant-checkbox-inner::after
    border-color: #a1a1a1 !important
</style>
