<script lang="ts">
import { computed, defineComponent, toRefs, ref } from 'vue';
import ComComVersionChanges from './ComComVersionChanges.vue';

const ComComVersionRelationshipTimeLineNode = defineComponent({
  name: 'ComComVersionRelationshipTimeLineNode',
  components: { ComComVersionChanges },
  props: {
    record: { type: Object, required: true },
  },
  setup(props) {
    const modalVisible = ref(false);

    const showChanges = () => {
      modalVisible.value = true;
    };

    const changesVisible = computed(() => {
      return props.record.changesVisible;
    });

    const fieldsMap = computed(() => {
      return props.record.fieldsMap;
    });

    return {
      ...toRefs(props),
      showChanges,
      changesVisible,
      modalVisible,
      fieldsMap,
    };
  },
});

export default ComComVersionRelationshipTimeLineNode;
</script>

<template lang="pug">
a-timeline-item.com-com-version-relationship-timeline-node
  .text-base.font-normal.text-gray-500.mb-2 {{ record.createdAtStr }}
  .flex.items-center.truncate
    TaAvatar.mr-1(:user='record.operator' :size='22')
    a-tooltip
      template(#title) {{ record.operator?.name }} {{ record.actionDesc  }}
      .flex.truncate
        .text-gray-500.text-sm.font-regular.mr-2 {{ record.operator?.name }}
        .text-gray-900.text-sm.font-normal.truncate {{ record.actionDesc }}
    TaIcon.ml-4.cursor-pointer.text-gray-400(
      v-if="changesVisible",
      type='InfoCircleOutlined',
      size='1rem',
      @click='showChanges()'
    )
  .flex.items-top.mt-2.text-gray-500(v-if='record.extraDesc')
    TaIcon.w-5.h-5.mr-2(type='solid/clipboard-list')
    .text-sm.font-normal {{ record.extraDesc }}
  a-modal(title='变更信息', v-model:visible='modalVisible', :width='960', :footer='null')
    ComComVersionChanges(:changes='record.version?.object_changes', :fieldsMap='fieldsMap')
    
</template>
