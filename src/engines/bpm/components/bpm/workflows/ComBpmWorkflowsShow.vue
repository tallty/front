<script lang="ts">
import { TaBreadcrumbInterface } from '@/components/global/ta-component/TaBreadcrumb.vue';
import { PropType, defineComponent, toRefs } from 'vue';

const ComBpmWorkflowsShow = defineComponent({
  name: 'ComBpmWorkflowsShow',
  components: {},
  props: {
    store: { type: Object, required: true },
    extendRoute: { type: String, default: '' },
    editable: { type: Boolean, default: true },
    breadcrumbs: { type: Array as PropType<TaBreadcrumbInterface[]>, default: () => [] },
  },
  emits: ['afterDelete', 'afterExtend'],
  setup(props, { emit }) {
    const afterDelete = () => {
      emit('afterDelete');
    };

    const afterExtend = () => {
      emit('afterExtend');
    };

    return {
      ...toRefs(props),

      record: props.store.record,
      afterDelete,
      afterExtend,
    };
  },
});
export default ComBpmWorkflowsShow;
</script>

<template lang="pug">
.com-bpm-rule-stat-workflows-show
  //- TaShowLayout(
  //-   :tabs='tabs',
  //-   :title='record.name',
  //-   :store='store',
  //-   :extendRoute='extendRoute',
  //-   :editable='editable',
  //-   :breadcrumbs='breadcrumbs',
  //-   template='bpm_workflow',
  //-   @afterDelete='afterDelete',
  //-   @afterExtend='afterExtend'
  //- )
  //-   //- template(#xxx_tab)
</template>

<style lang="stylus" scoped>
.com-bpm-rule-stat-workflows-show
  height 100%
</style>
