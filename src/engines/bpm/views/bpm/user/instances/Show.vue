<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VStore } from '@/lib/vails';
import { BpmUserInstances } from '../../../../bpm-core/apis/user/instance.api';
import { useRoute } from 'vue-router';
import ComBpmInstanceDetail from '@/engines/bpm/components/ComBpmInstanceDetail.vue';

const BpmUserInstancesShow = defineComponent({
  name: 'BpmUserInstancesShow',
  components: {
    ComBpmInstanceDetail,
  },
  props: {},
  setup(props) {
    const route = useRoute();
    const instanceId = Number(route.params.instanceId);

    return {
      ...toRefs(props),
      instanceId,
    };
  },
});

export default BpmUserInstancesShow;
</script>

<template lang="pug">
.bpm-user-instances-show
  ComBpmInstanceDetail(:instanceId='instanceId')
</template>

<style lang="stylus" scoped>
.bpm-user-instances-show
  height 100%
  width 100%
</style>
