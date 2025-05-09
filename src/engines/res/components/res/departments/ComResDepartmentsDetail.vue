<script lang="ts">
import { ref, defineComponent, toRefs, watch, onMounted } from 'vue';
import ComResMembersIndex from '@/engines/res/components/res/members/ComResMembersIndex.vue';

import { ResMemberDutiesApi } from '@/engines/res/res-core/apis/res/member/duties.api';
import { VStore } from '@/lib/vails';
import { ResMemberMembersApi } from '@/engines/res/res-core/apis/res/member/members.api';
const ComResDepartmentsDetail = defineComponent({
  name: 'ComResDepartmentsDetail',
  components: {
    ComResMembersIndex,
  },
  props: {
    record: { type: Object, required: true },
    tabs: { type: Array, required: true },
    id: { type: Number, required: true },
  },
  setup(props) {
    const resMemberDutiesStore = new VStore(new ResMemberDutiesApi({}));
    const dutiesFn = () => {
      resMemberDutiesStore.api = new ResMemberDutiesApi({
        params: {
          q: {
            departments_id_eq: props.id,
          },
        },
      });
      resMemberDutiesStore.index();
    };
    const resMemberMembersStore = new VStore(new ResMemberMembersApi({}));
    const membersFn = () => {
      resMemberMembersStore.api = new ResMemberMembersApi({
        params: {
          q: {
            departments_id_eq: props.id,
          },
        },
      });
      resMemberMembersStore.index();
    };
    watch(
      () => [props.record, props.id],
      () => {
        dutiesFn();
        membersFn();
      },
      {
        deep: true,
      },
    );
    onMounted(() => {
      dutiesFn();
      membersFn();
    });
    return {
      ...toRefs(props),
      resMemberDutiesStore,
      resMemberDutiesRecords: resMemberDutiesStore.records,
      resMemberMembersStore,
    };
  },
});
export default ComResDepartmentsDetail;
</script>

<template lang="pug">
.com-res-departments-detail
  .detail-main
    .basic-info.detail-box
      .name {{ record.name }}
      .tab.flex(v-for='infoItem in tabs')
        .label.flex.items-center
          TaIcon.icon(:type='infoItem.icon', :style='`font-size: 18px`')
          .text {{ infoItem.label }}
        .value {{ record[infoItem.key] }}
    //- .position-info.detail-box
      .title.value 职务
      .label.flex.items-center
        TaIcon.icon(type='TeamOutlined',:style="`font-size: 18px`")
        .text 部门领导
      .cell-main
        .cell.value(v-for="item in resMemberDutiesRecords") {{item.name}}
    .staffs-main.detail-box
      .label.flex.items-center
        TaIcon.icon(type='TeamOutlined', :style='`font-size: 18px`')
        .text 部门员工
      ComResMembersIndex.res-members-index(:store='resMemberMembersStore')
</template>

<style lang="stylus" scoped>
.com-res-departments-detail
  width 100%
  height 100%
  padding 0 20px
  overflow hidden
  .label
    min-width 152px
    position relative
    z-index 99
    .icon
      margin-right 12px
    .text
      color grey
      font-size 14px
  .value
    color #383838
    font-size 14px
  .detail-main
    height 100%
    .detail-box
      padding 20px 0
      border-bottom 1px solid #e5e5e5
      &:last-child
        border-bottom 0
    .basic-info
      .name
        padding-bottom 16px
        font-weight 500
        font-size 20px
        line-height 28px
      .tab
        padding 12px 0
    .position-info
      height 100%
      .title
        font-weight 500
        padding-bottom 20px
      .cell-main
        margin-top 16px
        .cell
          height 36px
          line-height 36px
          padding 0 8px
    .staffs-main
      height 100%
      // overflow scroll
      .res-members-index
        position relative
        top -30px
</style>
