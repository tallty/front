t
<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VStore } from '@/lib/vails';
import { BpmUserInstances, InstanceModel } from '../../../../bpm-core/apis/user/instance.api';
import ComBpmInstancePrint from '../../../../components/ComBpmInstancePrint.vue';
import { useRoute } from 'vue-router';
import { STORAGE_TOKEN_KEY } from '@/store/mutation-type';
import ls from '@/utils/local-storage';

const BpmUserInstancesPrint = defineComponent({
  name: 'BpmUserInstancesPrint',
  components: {
    ComBpmInstancePrint,
  },
  props: {},
  setup(props) {
    const route = useRoute();
    const instanceId = Number(route.params.instanceId);
    const token = route.query.token;

    if (token) {
      ls.set(STORAGE_TOKEN_KEY, token);
    }

    const store = new VStore(new BpmUserInstances(), InstanceModel);

    store.find(instanceId);

    return {
      ...toRefs(props),
      store,
      record: store.record,
      token,
    };
  },
});

export default BpmUserInstancesPrint;
</script>

<template lang="pug">
.bpm-user-instances-print
  ComBpmInstancePrint(v-if='record.id', :record='record', :needPostMessage='!!token')
</template>

<style lang="stylus" scoped>
.bpm-user-instances-print
  height 100%
  width 100%
  overflow auto

@media print
  .bpm-user-instances-print
    height auto
    overflow none
</style>
