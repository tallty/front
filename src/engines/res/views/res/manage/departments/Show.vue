<script lang="ts">
import ComResManageDepartmentShow from '@/engines/res/components/res/manage/departments/ComResManageDepartmentShow.vue';
import { defineComponent, toRefs, onMounted, computed } from 'vue';
import { ResManageDepartmentApi } from '@/engines/res/res-core/apis/res/manage/department.api';
import { ResDepartmentModel } from '@/engines/res/res-core/models/res/manage/department';
import { VStore } from '@/lib/vails';
import { useRoute } from 'vue-router';

const ResManageDepartmentShow = defineComponent({
  name: 'ResManageDepartmentShow',
  components: {
    ComResManageDepartmentShow,
  },
  setup(props) {
    const route = useRoute();

    const store = new VStore(new ResManageDepartmentApi(), ResDepartmentModel);

    const breadcrumbs = computed(() => [{ label: '', route: '/res/manage/departments' }]);

    onMounted(() => {
      store.find(Number(route.params.departmentId));
    });

    return {
      ...toRefs(props),
      store,
      record: store.record,
      breadcrumbs,
    };
  },
});

export default ResManageDepartmentShow;
</script>

<template lang="pug">
.res-manage-department-show
  ComResManageDepartmentShow(v-if='record.id', :store='store', :breadcrumbs='breadcrumbs')
</template>

<style lang="stylus" scoped>
.res-manage-department-show
  height 100%
  width 100%
  .breadcrumbs
    padding 0 24px
</style>
