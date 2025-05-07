<script lang="ts">
  import ComComAppsShow from '@/engines/com/components/com/apps/ComComAppsShow.vue';
  import { defineComponent, toRefs, onMounted, computed } from 'vue';
  import { ComAdminAppsApi } from '@/engines/com/apis/com/admin/apps.api';
  import { ComAppModel } from '@/engines/com/models/com/admin/apps';
  import { VStore } from '@/lib/vails';
  import { useRoute } from 'vue-router';

  const ComAdminAppsShow = defineComponent({
    name: 'ComAdminAppsShow',
    components: {
    ComComAppsShow,
  },
    setup(props) {
      const route = useRoute();
    
    const store = new VStore(new ComAdminAppsApi(), ComAppModel);
    
    const breadcrumbs = computed(() => [
      
    { label: '', route: '/com/admin/apps' },
          ]);

  onMounted(() => {
    store.find(Number(route.params.appId));
  });

  return {
    ...toRefs(props),
    store,
    record: store.record,
    breadcrumbs,
  };
  },
});

  export default ComAdminAppsShow;
</script>

<template lang="pug">
.com-admin-apps-show
  ComComAppsShow(v-if='record.id', :store='store', :breadcrumbs='breadcrumbs')
</template>

<style lang="stylus" scoped>
.com-admin-apps-show
  height 100%
  width 100%
  .breadcrumbs
    padding 0 24px
</style>
