<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import ComComVersionRelationshipsShow from './ComComVersionRelationshipsShow.vue';

const ComComVersionRelationshipsIndex = defineComponent({
  name: 'ComComVersionRelationshipsIndex',
  components: {
    ComComVersionRelationshipsShow,
  },
  props: {
    store: { type: Object, required: true },
  },
  setup(props) {
    const config = computed(() => ({
      recordName: '操作日志',
      store: props.store,
      mode: 'list',
      list: {
        scroll: { y: 'auto' },
      },
    }));

    return {
      ...toRefs(props),
      config,
    };
  },
});

export default ComComVersionRelationshipsIndex;
</script>

<template lang="pug">
.com-com-version-relationships-index
  TaIndexView(:config='config')
    template(#card='{ record }')
      ComComVersionRelationshipsShow(:record='record')

</template>

<style lang="stylus" scoped>
.com-com-version-relationships-index
  height 100%
  width 100%
</style>
