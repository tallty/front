<script lang="ts">
import { TofuEntry } from '../model';
import ComTofuMenuCell from './ComTofuMenuCell.vue';
import { defineComponent, PropType } from 'vue';

const ComTofuNestedMenu = defineComponent({
  name: 'ComTofuNestedMenu',
  components: {
    ComTofuMenuCell,
  },
  props: {
    record: { type: Object as PropType<TofuEntry>, required: true },
    clickItem: { type: Function, required: true },
  },
});
export default ComTofuNestedMenu;
</script>

<template lang="pug">
a-sub-menu(:title='record.name', :key='record.id')
  template(v-for='subRecord in record.children')
    a-menu-item(
      v-if='subRecord.children.length === 0',
      :title='subRecord.name',
      :key='subRecord.id'
    )
      ComTofuMenuCell(:record='subRecord', :showIcon='false')
    ComTofuNestedMenu(v-else, :record='subRecord')
</template>

<style lang="stylus" scoped></style>
