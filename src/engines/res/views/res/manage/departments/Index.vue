<script lang="ts">
import ComResManageDepartmentIndex from '@/engines/res/components/res/manage/departments/ComResManageDepartmentIndex.vue';
import { defineComponent } from '@vue/runtime-core';
import { ResManageDepartmentApi } from '@/engines/res/res-core/apis/res/manage/department.api';
import { ResDepartmentModel } from '@/engines/res/res-core/models/res/manage/department';
import { VStore } from '@/lib/vails';

import usePolicy from '@/components/global/ta-component/ta-template-form-core/usePolicy';

const ResManageDepartmentIndex = defineComponent({
  name: 'ResManageDepartmentIndex',
  components: {
    ComResManageDepartmentIndex,
  },
  setup() {
    usePolicy();

    const store = new VStore(new ResManageDepartmentApi(), ResDepartmentModel);

    return {
      store,
    };
  },
});

export default ResManageDepartmentIndex;
</script>

<template lang="pug">
.res-manage-department-index
  ComResManageDepartmentIndex(:store='store' )
</template>

<style lang="stylus" scoped>
.res-manage-department-index
  height 100%
  width 100%
</style>
