<script lang="ts">
import ComBpmStatWorkflowsShow from '@/engines/bpm/components/bpm/workflows/ComBpmStatWorkflowsShow.vue';
import { defineComponent, toRefs, onMounted, computed, ref } from 'vue';
import { VStore } from '@/lib/vails';
import { useRoute } from 'vue-router';
import { WorkflowModel, BpmAdminWorkflows } from '../../../../bpm-core/apis/admin/workflow.api';
import useNavigateTab from '@/components/global/ta-component/useNavigateTab';
import dayjs from 'dayjs';

const BpmStatWorkflowsShow = defineComponent({
  name: 'BpmStatWorkflowsShow',
  components: {
    ComBpmStatWorkflowsShow,
  },
  setup(props) {
    const route = useRoute();
    const { updateTitle } = useNavigateTab();
    console.log(route)
    const store = new VStore(new BpmAdminWorkflows(), WorkflowModel);
    const statistics = ref<any>(null)
    const breadcrumbs = computed(() => [

      { label: '', route: '/bpm/stat/workflows' },
    ]);

    onMounted(() => {
      store.find(Number(route.params.workflowId)).then(() => {
        updateTitle(store.record.value.name, route.fullPath);
      }).then(() => {
        store.sendMemberAction({
          action: 'ta_resource_statistic',
          id: store.record.value.id as number,
          config: {
            data: {
              stat_condition: {
                refs: [
                  {
                    relations: ['instances'],
                    item: {
                      key: '状态',
                      scopes: {
                        between_times: [
                          dayjs((route.query?.start_at as any)).format('YYYY-MM-DD 00:00:00 Z'),
                          dayjs((route.query?.end_at as any)).format('YYYY-MM-DD 00:00:00 Z')
                        ]
                      },
                      caculator: {
                        type: 'caculation',
                        caculations: [
                          { name: '待提交', method: 'count', filter: { state_eq: 'created' } },
                          { name: '进行中', method: 'count', filter: { state_eq: 'processing' } },
                          { name: '已完成', method: 'count', filter: { state_eq: 'completed' } },
                          { name: '已终止', method: 'count', filter: { state_eq: 'terminated' } },
                          { name: '总发起数', method: 'count' },
                        ]
                      },
                    },
                  }
                ]
              }
            }
          }
        }).then((res) => {

          statistics.value = res.data.状态
        })
      })

    });

    return {
      ...toRefs(props),
      store,
      record: store.record,
      breadcrumbs,
      route,
      statistics,
    };
  },
});

export default BpmStatWorkflowsShow;
</script>

<template lang="pug">
.bpm-stat-workflows-show
  ComBpmStatWorkflowsShow(
    v-if='record.id&&statistics',
    :store='store',
    :breadcrumbs='breadcrumbs',
    :statistics='statistics',
    :start_at='route.query?.start_at',
    :end_at='route.query?.end_at',
  )
</template>

<style lang="stylus" scoped>
.bpm-stat-workflows-show
  height 100%
  width 100%
  .breadcrumbs
    padding 0 24px
</style>
