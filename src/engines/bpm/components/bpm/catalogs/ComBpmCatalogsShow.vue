<script lang="ts">
import { TaBreadcrumbInterface } from '@/components/global/ta-component/TaBreadcrumb.vue';
import { PropType, defineComponent, toRefs } from 'vue';
import { BpmCatalogTemplate } from './template';

const ComBpmCatalogsShow = defineComponent({
  name: 'ComBpmCatalogsShow',
  components: {},
  props: {
    store: { type: Object, required: true },
    extendRoute: { type: String, default: '' },
    editable: { type: Boolean, default: true },
    breadcrumbs: { type: Array as PropType<TaBreadcrumbInterface[]>, default: () => [] },
  },
  emits: ['afterDelete', 'afterExtend'],
  setup(props, { emit }) {
    const tabs = [
      {
        key: 'info',
        label: '基本信息',
      },
      // {
      //   key: 'xxx',
      //   label: 'xxx',
      // },
    ];

    const afterDelete = () => {
      emit('afterDelete');
    };

    const afterExtend = () => {
      emit('afterExtend');
    };

    return {
      ...toRefs(props),
      tabs,
      record: props.store.record,
      afterDelete,
      afterExtend,
      BpmCatalogTemplate,
    };
  },
});
export default ComBpmCatalogsShow;
</script>

<template lang="pug">
.com-bpm-admin-catalogs-show
  TaShowLayout(
    :tabs='tabs',
    :title='record.name',
    :store='store',
    :extendRoute='extendRoute',
    :editable='editable',
    :breadcrumbs='breadcrumbs',
    :template='BpmCatalogTemplate',
    @afterDelete='afterDelete',
    @afterExtend='afterExtend'
  )
    //- template(#xxx_tab)
</template>

<style lang="stylus" scoped>
.com-bpm-admin-catalogs-show
  height 100%
</style>
