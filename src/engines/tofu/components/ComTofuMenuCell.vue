<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { TofuEntry } from '../model';
import { useAutoMenuHelper } from './useAutoMenu';

const ComTofuMenuCell = defineComponent({
  name: 'ComTofuMenuCell',
  components: {},
  props: {
    record: { type: Object as PropType<TofuEntry>, required: true },
    showIcon: { type: Boolean, default: false },
  },
  setup(props) {
    const { isExternalLink, onSelectMenu } = useAutoMenuHelper();

    return {
      ...toRefs(props),
      isExternalLink,
      onSelectMenu,
    };
  },
});
export default ComTofuMenuCell;
</script>

<template lang="pug">
.com-tofu-menu-cell
  .group(v-if='!record.url || isExternalLink(record.url)', @click='onSelectMenu(record)')
    TaIcon(v-if='showIcon', :type='record.icon')
    | {{ record.name }}
  router-link(v-else, :to='record.url')
    .group
      TaIcon(v-if='showIcon', :type='record.icon')
      | {{ record.name }}
</template>

<style lang="stylus" scoped>
.group
  color rgba(0, 0, 0, 0.65)
  display flex
  align-items center
</style>
