<script lang="ts">
import { defineComponent, toRefs, onMounted, ref, nextTick, computed } from 'vue';
import { VStore } from '@/lib/vails';
import { Workflow } from '../../../../bpm-core/types';
import { BpmUserWorkflows } from '@/engines/bpm/bpm-core/apis/user/workflowl.api';
import ComWorkflowCell from '../../../../components/ComWorkflowCell.vue';
import ComBpmInstanceCreator from '../../../../components/ComBpmInstanceCreator.vue';
import ComWorkflowColorfulCard from '@/engines/bpm/components/bpm/workflows/ComWorkflowColorfulCard.vue';
import { BpmUserCatalogsApi } from '../../../../apis/bpm/user/catalogs.api';
import { BpmCatalog } from '@/engines/bpm/types/model';
import { VObject } from '../../../../../../lib/vails/model/index';
import { WorkflowModel } from '../../../../bpm-core/apis/admin/workflow.api';
import { BpmUserDashboardApi } from '@/engines/bpm/apis/bpm/user/dashboard.api';
import { useRouter } from 'vue-router';
import { t } from '@wangeditor/core';

const BpmUserWorkflowsIndex = defineComponent({
  name: 'BpmUserWorkflowsIndex',
  components: {
    ComWorkflowCell,
    ComBpmInstanceCreator,
    ComWorkflowColorfulCard,
  },
  props: {
    query: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const store = new VStore(
      new BpmUserWorkflows({
        // params: { q: { unflowable: true, classify_eq: 'direct' } },
        params: { q: { classify_eq: 'direct', s: ['position asc'] } },
      }),
      WorkflowModel,
    );

    const activeCatalogIds = ref<number[]>([]);
    const catalogStore = new VStore(new BpmUserCatalogsApi());

    catalogStore.index({
      q: {
        s: ['position asc'],
      },
    });

    const dashboard = ref<VObject>({});

    const fetchDashboard = () => {
      new BpmUserDashboardApi().find().then((res: any) => {
        dashboard.value = res.data;
      });
    };

    fetchDashboard();

    const onCatalogClick = (catalog: BpmCatalog) => {
      const existedIndex = activeCatalogIds.value.findIndex((id: number) => id === catalog.id);
      if (existedIndex >= 0) {
        activeCatalogIds.value.splice(existedIndex, 1);
      } else {
        activeCatalogIds.value.push(catalog.id);
      }
    };

    const selectedWorkflowId = ref(0);
    const creator = ref<any>(null);

    const onCreateInstance = async (workflow: Workflow) => {
      selectedWorkflowId.value = workflow.id;
      nextTick(() => creator.value.onCreateInstance());
    };

    const config = computed(() => ({
      recordName: '',
      store,
      mode: 'list',
      pagination: {
        perPage: 8,
      },
      params: temporaryParams.value,
      list: {
        splitCount: 4,
        // scroll: { y: 'auto' },
      },
    }));

    const searchQuery = ref<VObject>({});
    const searcher = ref<any>(null);

    const onSearch = () => {
      searcher.value?.onSearch();
    };

    const onResetSearch = () => {
      searcher.value?.resetSearch();
    };

    const temporaryQuery = computed(() => ({
      catalog_id_in: activeCatalogIds.value,
      ...searchQuery.value,
    }));

    const onResetCatalog = () => {
      activeCatalogIds.value = [];
    };

    const router = useRouter();

    const toInstance = () => {
      router.push('/bpm/user/instances');
    };

    const visibleMyLike = ref(false);
    const onClickMyLike = () => {
      visibleMyLike.value = !visibleMyLike.value;
    };

    const temporaryParams = computed(() => ({
      mode: visibleMyLike.value ? 'star' : undefined,
    }));

    return {
      ...toRefs(props),
      // groups,
      config,
      creator,
      onCreateInstance,
      selectedWorkflowId,
      catalogs: catalogStore.records,
      activeCatalogIds,
      onCatalogClick,
      temporaryQuery,
      searcher,
      searchQuery,
      onSearch,
      onResetSearch,
      onResetCatalog,
      dashboard,
      fetchDashboard,
      toInstance,
      visibleMyLike,
      onClickMyLike,
    };
  },
});

export default BpmUserWorkflowsIndex;
</script>

<template lang="pug">
.bpm-user-workflow-index.flex
  .head.flex
    .my-like.square.flex-center.shadow.cursor-pointer(
      @click='onClickMyLike',
      :class='{ "my-like-clicked": visibleMyLike }'
    )
      .label 我收藏的
      .count {{ dashboard.star_workflows_count }}
    .my-common.shadow.flex
      .flex-center
        .shell.square.flex-center
          .label 我常用的
          .count {{ dashboard.created_workflows?.length || 0 }}
      .workflows.flex
        .workflow.flex-center(
          v-for='workflow in dashboard.created_workflows',
          @click='onCreateInstance(workflow)'
        )
          TaColorfulIcon.icon(:config='{ icon: "HomeFilled" }')
          .name {{ workflow.name }}

    .to-instance.square.flex-center.shadow.cursor-pointer(@click='toInstance')
      .label 待我处理
      .count {{ dashboard.approving_instances_count }}

  .filters
    .catalogs.flex
      .label.flex
        span 类目
      .content.flex
        template(v-for='catalog in catalogs')
          .catalog(
            :class='{ "active-catalog": activeCatalogIds.includes(catalog.id) }',
            @click='onCatalogClick(catalog)'
          )
            | {{ catalog.name }}
    .searcher.flex
      .label.flex
        span 搜索
      .content.flex-between
        .searcher.flex
          TaSearcher(ref='searcher', v-model:value='searchQuery', :variables='["name"]')
          a-button.search-button(@click='onSearch') 搜索
          a-button.reset-button(@click='onResetSearch') 重置
        TaTextButton.empty(icon='DeleteOutlined', @click='onResetCatalog') 清空选择
  TaIndexView.ta-index-view(:config='config', :temporaryQuery='temporaryQuery')
    template(#header)
      .empty
    template(#card='{ record }')
      ComWorkflowColorfulCard.workflow-card(
        :workflow='record',
        @fresh='fetchDashboard',
        @createInstance='onCreateInstance(record)'
      )

  //- .group(v-for="group in groups" :key="group.key")
  //-   .group-name {{ group.key }}
  //-   a-row(:gutter="16")
  //-     a-col(:span="12" v-for="workflow in group.workflows" :key="workflow.id")
  //-       .workflow
  //-         ComWorkflowCell(:workflow='workflow', @click.native='onCreateInstance(workflow)')
  ComBpmInstanceCreator(
    ref='creator',
    :workflowId='selectedWorkflowId',
    :canSaveAndCreateNext='true'
  )
</template>

<style lang="stylus" scoped>
.bpm-user-workflow-index
  width 100%
  height 100%
  overflow auto
  flex-direction column
  min-width 840px
  .my-like-clicked
    background $primary-color
    color white !important
  // justify-content space-between
  >>>.workflow-card
    .body
      .actions
        .ant-btn
          background $primary-color
          border-color $primary-color
  .to-instance
    cursor pointer
  .head
    width 100%
    justify-content space-between
    align-items center
    .square
      width 130px
      height 130px
      font-weight 500
      color $primary-color
      padding 24px 0 26px 0
      display flex
      flex-direction column
      align-content center
      justify-content space-between
      .label
        font-size 14px
      .count
        font-size 42px
        line-height 36px
    .shadow
      box-shadow 0px 0px 4px 1px rgba(12, 31, 80, 0.12)
      border-radius 4px
    .my-common
      height 130px
      width calc(100% - 300px)
      align-items center
      .shell
        border-right 1px solid rgba(12, 31, 80, 0.12)
    .workflows
      margin-top 20px // 滚动条会占有高度，偏移一点使视觉上看起来对齐
      overflow-x auto
      padding-bottom 20px
      &::-webkit-scrollbar
        height 4px
      .workflow
        cursor pointer
        flex-direction column
        padding 0 32px
        justify-content center
        .icon
          margin-bottom 8px
        .name
          text-align center
          width 100px
          height 40px
          font-size 14px
          line-height 20px
          overflow hidden
          display -webkit-box
          text-overflow ellipsis
          -webkit-box-orient vertical
          -webkit-line-clamp 2
  .filters
    margin 24px 0
    background #FFFFFF
    box-shadow 0px 3px 6px 0px rgba(0, 0, 0, 0.1)
    border-radius 12px
    border 1px solid #E5E5E5
    .catalogs
      border-bottom 1px solid rgba(229, 229, 229, 1)
      .catalog
        display flex
        justify-content center
        align-items center
        min-width 110px
        padding 7px 10px
        background rgba(247, 247, 247, 1)
        font-size 14px
        font-weight 400
        color #8C8C8C
        margin-right 16px
        margin-bottom 8px
        border-radius 4px
        cursor pointer
      .active-catalog
        color white
        background $primary-color
    .catalogs, .searcher
      width 100%
      .label
        align-items center
        // width 175px
        flex-shrink 0
        padding 22px 34px
        background rgba(247, 247, 247, 1)
        font-size 16px
        font-weight 600
        color #595959
        line-height 22px
      .content
        padding 10px 16px
        flex-wrap wrap
        flex-grow 1
        .searcher
          width 600px
          padding 6px 0
        .empty
          padding 6px 0
    .search-button, .reset-button
      margin-left 8px
    .search-button
      border 1px solid $primary-color
      color $primary-color
  .ta-index-view
    margin-left -16px
    width calc(100% + 16px)
</style>
