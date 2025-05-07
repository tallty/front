<script lang="ts">
import { defineComponent, toRefs, onMounted, ref, nextTick } from 'vue';
import { VStore } from '@/lib/vails';
import { BpmUserWorkflows } from '@/engines/bpm/bpm-core/apis/user/workflowl.api';
import ComBpmWorkflowShow from '../../../../components/ComBpmWorkflowShow.vue';
import { BpmUserCreatedInstances } from '@/engines/bpm/bpm-core/apis/user/created/instance.api';
import { BpmUserApprovingInstances } from '@/engines/bpm/bpm-core/apis/user/approving/instance.api';
import { BpmUserApprovedInstances } from '@/engines/bpm/bpm-core/apis/user/approved/instance.api';
import { BpmUserNotifiedInstances } from '@/engines/bpm/bpm-core/apis/user/notified/instance.api';
import { BpmUserInstances } from '@/engines/bpm/bpm-core/apis/user/instance.api';
import { useRoute } from 'vue-router';
import { WorkflowModel } from '../../../../bpm-core/apis/admin/workflow.api';
import { BpmUserMetaRecords } from '../../../../bpm-core/apis/user/meta_record.api';

const BpmUserWorkflowsIndex = defineComponent({
  name: 'BpmUserWorkflowsIndex',
  components: {
    ComBpmWorkflowShow,
  },
  props: {},
  setup(props) {
    const route = useRoute();
    const workflowId = Number(route.params.workflowId);

    const workflowStore = new VStore(new BpmUserWorkflows(), WorkflowModel);

    const instanceApi = new BpmUserInstances({
      params: { q: { s: ['id desc'] } },
      parents: [{ type: 'workflows', id: workflowId }],
    });
    const instanceCreatedApi = new BpmUserCreatedInstances({
      params: { q: { s: ['id desc'], workflow_id_eq: workflowId } },
    });
    const instanceApprovingApi = new BpmUserApprovingInstances({
      params: { q: { s: ['id desc'], workflow_id_eq: workflowId } },
    });
    const instanceApprovedApi = new BpmUserApprovedInstances({
      params: { q: { s: ['id desc'], workflow_id_eq: workflowId } },
    });
    const instanceNotifiedApi = new BpmUserNotifiedInstances({
      params: { q: { s: ['id desc'], workflow_id_eq: workflowId } },
    });

    const meteRecordApi = new BpmUserMetaRecords({
      parents: [{ type: 'workflows', id: workflowId }],
    });

    return {
      ...toRefs(props),
      workflowStore,
      instanceApi,
      instanceCreatedApi,
      instanceApprovingApi,
      instanceApprovedApi,
      instanceNotifiedApi,
      meteRecordApi,
    };
  },
});

export default BpmUserWorkflowsIndex;
</script>

<template lang="pug">
.bpm-user-workflow-show
  ComBpmWorkflowShow(
    :workflowStore='workflowStore',
    :instanceApi='instanceApi',
    :instanceCreatedApi='instanceCreatedApi',
    :instanceApprovingApi='instanceApprovingApi',
    :instanceApprovedApi='instanceApprovedApi',
    :instanceNotifiedApi='instanceNotifiedApi',
    :meteRecordApi='meteRecordApi',
  )
</template>

<style lang="stylus" scoped>
.bpm-user-workflow-show
  height 100%
  width 100%
</style>
