<script lang="ts">
import ComComThemeShow from '@/engines/com/components/com/themes/ComComThemeShow.vue';
import { defineComponent, toRefs, onMounted, computed } from 'vue';
import { ComAdminThemeApi } from '@/engines/com/apis/com/admin/theme.api';
import { VStore } from '@/lib/vails';
import { useRoute } from 'vue-router';

const ComAdminThemeShow = defineComponent({
  name: 'ComAdminThemeShow',
  components: {
    ComComThemeShow,
  },
  setup(props) {
    const route = useRoute();
    const routes = useRoute();
    const appId = Number(routes.params.appId);
    const store = new VStore(
      new ComAdminThemeApi({
        parents: [{ type: 'apps', id: appId }],
      }),
    );

    const breadcrumbs = computed(() => [{ label: '', route: `/com/admin/apps/:appId/themes` }]);

    onMounted(() => {
      store.find(Number(route.params.themeId));
    });

    return {
      ...toRefs(props),
      store,
      record: store.record,
      breadcrumbs,
    };
  },
});

export default ComAdminThemeShow;
</script>

<template lang="pug">
.com-admin-theme-show
  ComComThemeShow(v-if='record.id', :store='store', :breadcrumbs='breadcrumbs')
</template>

<style lang="stylus" scoped>
.com-admin-theme-show
  height 100%
  width 100%
  .breadcrumbs
    padding 0 24px
</style>
