<script lang="ts">
import { FormsResourceInfoFindByIds } from '@/components/global/ta-component/TaTemplateForm/form/apis/find_by_ids.api';
import { TaTemplateFormSelect } from '@/components/global/ta-component/ta-template-form-core/types';
import { Place } from '@/engines/bpm/bpm-core/types';
import { VObject } from '@/lib/vails/model';
import { PropType, computed, defineComponent, reactive, toRefs, watch } from 'vue';
import { levelDutyRankSelect } from '../nodeEditor/template';

const ComBpmFlowTreeNodeApprovalContext = defineComponent({
  name: 'ComBpmFlowTreeNodeApprovalContext',
  components: {},
  props: {
    node: { type: Object as PropType<Place>, required: true },
  },
  setup(props) {
    const data = reactive<VObject>({
      userNames: '',
      orgNames: '',
      dutyNames: '',
      departmentNames: '',
      roleNames: '',
      memberIdentityNames: '',
      placeNames: '',
    });

    const getNames = async (ids: number[], path: string, key = 'name') => {
      const { data } = await new FormsResourceInfoFindByIds().create({
        path,
        ids,
        attrs: [key],
      });

      return data.records.map((user: VObject) => user[key]).join('，');
    };

    const defineWatcher = (
      watchValue: () => number[] | undefined,
      variable: string,
      path: string,
      defaultValue: string,
      key = 'name',
    ) => {
      watch(
        watchValue,
        async (newValue?: number[], oldValue?: number[]) => {
          if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            if (newValue && newValue.length > 0) {
              data[variable] = await getNames(newValue, path, key);
            } else {
              data[variable] = defaultValue;
            }
          }
        },
        { immediate: true, deep: true },
      );
    };

    defineWatcher(
      () => props.node.options?.user_options?.user_ids,
      'userNames',
      '/res/admin/users',
      '请选择审批人',
    );

    defineWatcher(
      () => props.node.options?.user_options?.org_ids,
      'orgNames',
      'res/admin/orgs',
      '',
    );

    defineWatcher(
      () => props.node.options?.user_options?.duty_ids,
      'dutyNames',
      'res/admin/duties',
      '请选择岗位',
    );

    defineWatcher(
      () => props.node.options?.user_options?.department_ids,
      'departmentNames',
      'res/admin/departments',
      '',
    );

    defineWatcher(
      () => props.node.options?.user_options?.role_ids,
      'roleNames',
      'com/admin/roles',
      '请选择角色',
      'label',
    );

    defineWatcher(
      () => props.node.options?.user_options?.member_identity_ids,
      'memberIdentityNames',
      'res/admin/member_identities',
      '请选择身份',
    );

    defineWatcher(
      () => props.node.options?.user_options?.place_ids,
      'placeNames',
      'bpm/user/places',
      '请选择节点',
    );

    const ranks = computed(
      () =>
        props.node.options.user_options?.ranks
          ?.map(
            (rank: string) =>
              levelDutyRankSelect.find((item: TaTemplateFormSelect) => item.value === rank)?.label,
          )
          ?.join('，') || '',
    );

    return {
      ...toRefs(data),
      ranks,
    };
  },
});

export default ComBpmFlowTreeNodeApprovalContext;
</script>

<template lang="pug">
.com-bpm-flow-tree-node-approval-context
  //- 发起人自己
  template(v-if='node.options.user_options.type === "Bpm::Attr::SponsorSelf"')
    span 发起人自己
  //- 发起人自己
  template(v-if='node.options.user_options.type === "Bpm::Attr::TokenUserSelf"')
    span 上个节点处理人
  //- 直接主管
  template(v-if='node.options.user_options.type === "Bpm::Attr::DirectManager"')
    span 直接主管
  //- 发起人自选
  template(v-else-if='node.options.user_options.type === "Bpm::Attr::UserList"')
    span 指定人
    a-popover
      template(#content)
        span {{ userNames }}
      a-tag(color='blue') {{ userNames }}
  template(v-else-if='node.options.user_options.type === "Bpm::Attr::PlaceDoneUsers"')
    span 指定节点处理人&nbsp;
    a-popover
      template(#content)
        span {{ placeNames }}
      a-tag(color='blue') {{ placeNames }}
  //- 工作流角色
  template(v-else-if='node.options.user_options.type === "Bpm::Attr::FlowableRole"')
    span 角色 {{ node.options.user_options.role }}
  //- 岗位
  template(v-else-if='node.options.user_options.type === "Bpm::Attr::Duty"')
    span {{ orgNames && `【${orgNames}】` }}{{ departmentNames && `（${departmentNames}）` }}{{ dutyNames }}
  //- 角色
  template(v-else-if='node.options.user_options.type === "Bpm::Attr::Role"')
    span {{ orgNames && `【${orgNames}】` }}{{ departmentNames && `（${departmentNames}）` }}{{ roleNames }}
  //- 身份
  template(v-else-if='node.options.user_options.type === "Bpm::Attr::MemberIdentity"')
    span {{ orgNames && `【${orgNames}】` }}{{ departmentNames && `（${departmentNames}）` }}{{ memberIdentityNames }}
  //- 部门岗位
  template(v-else-if='node.options.user_options.type === "Bpm::Attr::LevelDutyRank"')
    span(v-if='node.options.user_options.level && node.options.user_options.ranks.length > 0')
      | 第{{ node.options.user_options.level }}级部门 {{ ranks }}
</template>

<style lang="stylus" scoped></style>
