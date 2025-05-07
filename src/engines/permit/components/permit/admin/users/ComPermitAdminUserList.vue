<template lang="pug">
.w-full.flex.flex-col.h-0.flex-grow 
  .w-full.items-center.flex.pb-4
    .mr-3
      a-checkbox(:checked='checkedAll' @click='checkChange') 全选
    a-checkbox-group(v-model:value="checked", name="checkboxgroup", :options="selectList" )
  .h-0.flex-grow.w-full.overflow-y-scroll.pr-6(v-if='activeRole?.id')
    ComPermitAdminUserListUser(ref='userRef', :activeRole='activeRole', @addRoleRelation="addRoleRelation('role#user_relation')", @delRoleRelation='delRoleRelation' v-if='checked.includes(1)')
    ComPermitAdminUserListDuty(ref='dutyRef', :activeRole='activeRole', @addRoleRelation="addRoleRelation('role#duty_relation')", @delRoleRelation='delRoleRelation' v-if='checked.includes(2)')
    ComPermitAdminUserListOrg(ref='orgRef', :activeRole='activeRole', @addRoleRelation="addRoleRelation('role#org_relation')" @delRoleRelation='delRoleRelation' v-if='checked.includes(3)')
    ComPermitAdminUserListMemberIdentity(ref='miRef', :activeRole='activeRole', @addRoleRelation="addRoleRelation('role#membership_relation')", @delRoleRelation='delRoleRelation' v-if='checked.includes(4)')
  TaTemplateFormWithActionsDrawer(
    v-model:visible='visible.formDrawer',
    :template='relationTemplate',
    :record='record',
    @afterSave='afterSave()'
)
</template>
<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue';
import { VModel, VStore } from '@/lib/vails';
import { PermitAdminRolesApi } from '../../../../apis/permit/admin/role.api';
import ComPermitAdminUserListUser from './ComPermitAdminUserListUser.vue';
import ComPermitAdminUserListDuty from './ComPermitAdminUserListDuty.vue';
import ComPermitAdminUserListOrg from './ComPermitAdminUserListOrg.vue';
import ComPermitAdminUserListMemberIdentity from './ComPermitAdminUserListMemberIdentity.vue';

const ComPermitAdminUserList = defineComponent({
  name: 'ComPermitAdminUserList',
  components: {
    ComPermitAdminUserListUser,
    ComPermitAdminUserListDuty,
    ComPermitAdminUserListOrg,
    ComPermitAdminUserListMemberIdentity,
  },
  props: {
    activeRole: { type: Object, default: () => {} },
  },
  emits: ['reload'],
  setup(props, { emit }) {
    const selectList = computed(() => [
      {
        label: `用户•${props.activeRole?.count_info?.user_count || 0}`,
        value: 1,
      },
      {
        label: `岗位•${props.activeRole?.count_info?.duty_count || 0}`,
        value: 2,
      },
      {
        label: `组织•${props.activeRole?.count_info?.org_count || 0}`,
        value: 3,
      },
      {
        label: `身份•${props.activeRole?.count_info?.member_identity_count || 0}`,
        value: 4,
      },
    ]);
    const checked = ref<any[]>([1, 2, 3, 4]);
    const checkedAll = computed(() => {
      return checked.value.length === selectList.value.length;
    });

    const checkChange = (e: any) => {
      if (e.target.checked) {
        checked.value = [...selectList.value.map(el => el.value)];
      } else {
        checked.value = [];
      }
    };

    const relationTemplate = ref({});
    const userRef = ref();
    const dutyRef = ref();
    const orgRef = ref();
    const miRef = ref();
    const roleStore = new VStore(new PermitAdminRolesApi());
    const record = ref({});
    const visible = ref({
      formDrawer: false,
      indexDrawer: false,
    });

    const addRoleRelation = (templateStr: string) => {
      roleStore.find(Number(props.activeRole.id)).then(({ data }) => {
        relationTemplate.value = templateStr;
        record.value = roleStore.new(data);
        visible.value.formDrawer = true;
      });
    };

    const delRoleRelation = (type: string, roleId: number, userId: number) => {
      roleStore
        .sendMemberAction({
          action: 'remove_relation',
          id: roleId,
          config: {
            data: {
              type,
              relation_id: userId,
            },
          },
        })
        .then((res: any) => {
          if (type === 'user') {
            userRef.value.loadData();
          } else if (type === 'org') {
            orgRef.value.loadData();
          } else if (type === 'duty') {
            dutyRef.value.loadData();
          } else if (type === 'member_identity') {
            miRef.value.loadData();
          }
          emit('reload', roleId);
        });
    };

    const afterSave = () => {
      userRef?.value?.loadData();
      orgRef?.value?.loadData();
      dutyRef?.value?.loadData();
      miRef?.value?.loadData();
      emit('reload', props.activeRole?.id);
    };

    return {
      ...toRefs(props),
      checked,
      selectList,
      checkedAll,
      checkChange,
      afterSave,
      roleStore,
      record,
      visible,
      addRoleRelation,
      delRoleRelation,
      relationTemplate,
      userRef,
      dutyRef,
      orgRef,
      miRef,
    };
  },
});
export default ComPermitAdminUserList;
</script>
<style lang="stylus" scoped>
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
</style>
