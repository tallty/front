<script lang="ts">
import ComComSearchItemsShow from '@/engines/com/components/com/search_items/ComComSearchItemsShow.vue';
import { defineComponent, toRefs, onMounted, computed } from 'vue';
import { ComAdminSearchItemsApi } from '@/engines/com/apis/com/admin/search_items.api';
import { VStore } from '@/lib/vails';
import { useRoute } from 'vue-router';

const ComAdminSearchItemsShow = defineComponent({
  name: 'ComAdminSearchItemsShow',
  components: {
    ComComSearchItemsShow,
  },
  setup(props) {
    const route = useRoute();

    const store = new VStore(new ComAdminSearchItemsApi());

    const breadcrumbs = computed(() => [{ label: '', route: '/com/admin/search_items' }]);

    onMounted(() => {
      store.find(Number(route.params.search_itemId));
    });

    return {
      ...toRefs(props),
      store,
      record: store.record,
      breadcrumbs,
    };
  },
});

export default ComAdminSearchItemsShow;
</script>

<template lang="pug">
.com-admin-search-items-show
  ComComSearchItemsShow(v-if='record.id', :store='store', :breadcrumbs='breadcrumbs')
</template>

<style lang="stylus" scoped>
.com-admin-search-items-show
  height 100%
  width 100%
  .breadcrumbs
    padding 0 24px
</style>
