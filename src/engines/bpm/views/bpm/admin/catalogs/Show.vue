<script lang="ts">
import ComBpmCatalogsShow from '@/engines/bpm/components/bpm/catalogs/ComBpmCatalogsShow.vue';
import { defineComponent, toRefs, onMounted, computed } from 'vue';
import { BpmAdminCatalogsApi } from '@/engines/bpm/apis/bpm/admin/catalogs.api';
import { VStore } from '@/lib/vails';
import { useRoute } from 'vue-router';

const BpmAdminCatalogsShow = defineComponent({
  name: 'BpmAdminCatalogsShow',
  components: {
    ComBpmCatalogsShow,
  },
  setup(props) {
    const route = useRoute();

    const store = new VStore(new BpmAdminCatalogsApi());

    const breadcrumbs = computed(() => [{ label: '', route: '/bpm/admin/catalogs' }]);

    onMounted(() => {
      store.find(Number(route.params.catalogId));
    });

    return {
      ...toRefs(props),
      store,
      record: store.record,
      breadcrumbs,
    };
  },
});

export default BpmAdminCatalogsShow;
</script>

<template lang="pug">
.bpm-admin-catalogs-show
  ComBpmCatalogsShow(v-if='record.id', :store='store', :breadcrumbs='breadcrumbs')
</template>

<style lang="stylus" scoped>
.bpm-admin-catalogs-show
  height 100%
  width 100%
  .breadcrumbs
    padding 0 24px
</style>
