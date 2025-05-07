<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import ComComVersionRelationshipTimeLineNode from './ComComVersionRelationshipTimelineNode.vue';

const ComComVersionRelationshipsShow = defineComponent({
  name: 'ComComVersionRelationshipsShow',
  components: {
    ComComVersionRelationshipTimeLineNode,
  },
  props: {
    record: { type: Object, required: true },
  },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});

export default ComComVersionRelationshipsShow;
</script>

<template lang="pug">
.com-com-version-relationships-show
  ComComVersionRelationshipTimeLineNode(:record='record')
</template>
