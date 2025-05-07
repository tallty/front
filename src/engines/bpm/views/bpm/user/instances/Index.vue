<script lang="ts">
import { defineComponent, onMounted, toRefs } from 'vue';
import { VStore } from '@/lib/vails';
import { BpmUserInstances } from '../../../../bpm-core/apis/user/instance.api';
import ComBpmInstancesIndex from '../../../../components/ComBpmInstanceIndex.vue';
import { EncryptRouteId } from '@/components/global/ta-component/utils/EncryptRouteId';
import { useRoute } from 'vue-router';
import useNavigateTab from '@/components/global/ta-component/useNavigateTab';
import { useI18n } from 'vue-i18n';

const BpmUserInstancesIndex = defineComponent({
  name: 'BpmUserInstancesIndex',
  components: {
    ComBpmInstancesIndex,
  },
  props: {},
  setup(props) {
    const store = new VStore(new BpmUserInstances());

    const route = useRoute();
    const { t } = useI18n();
    const { updateTitle } = useNavigateTab();

    const { id, params } = EncryptRouteId.decrypt(String(route.params.workflowId || ''));
    const instanceParams = id
      ? {
          q: {
            workflow_id_eq: id,
            ...params,
          },
        }
      : {
          ...params,
        };

    onMounted(() => {
      updateTitle(t('bpm.route.BpmUserInstancesIndex'), route.fullPath);
    });
    return {
      ...toRefs(props),
      store,
      instanceParams,
      t,
    };
  },
});

export default BpmUserInstancesIndex;
</script>

<template lang="pug">
.bpm-user-instances-index
  ComBpmInstancesIndex(:store='store', :params='instanceParams' :title='t("bpm.BpmUserInstancesIndex.title")')
</template>

<style lang="stylus" scoped>
.bpm-user-instances-index
  height 100%
  width 100%
</style>
