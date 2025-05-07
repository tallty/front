<script lang="ts">
import ComResManageUserIndex from '@/engines/res/components/res/manage/users/ComResManageUserIndex.vue';
import { defineComponent } from '@vue/runtime-core';
import { ResManageUserApi } from '@/engines/res/res-core/apis/res/manage/user.api';
import { ResUserModel } from '@/engines/res/res-core/models/res/manage/user';
import { VStore } from '@/lib/vails';

import usePolicy from '@/components/global/ta-component/ta-template-form-core/usePolicy';

const ResManageUserIndex = defineComponent({
  name: 'ResManageUserIndex',
  components: {
    ComResManageUserIndex,
  },
  setup() {
    usePolicy();

    const store = new VStore(new ResManageUserApi(), ResUserModel);

    return {
      store,
    };
  },
});

export default ResManageUserIndex;
</script>

<template lang="pug">
.res-manage-user-index
  ComResManageUserIndex(:store='store' )
</template>

<style lang="stylus" scoped>
.res-manage-user-index
  height 100%
  width 100%
</style>
