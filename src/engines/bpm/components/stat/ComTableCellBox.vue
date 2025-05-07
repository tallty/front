<script lang='ts'>
import { ref, defineComponent, toRefs, computed } from 'vue';


const ComTableCellBox = defineComponent({
  name: 'ComTableCellBox',
  components: {},
  props: {
    data: { type: Object, default: () => ({}) },
    handle: { type: Function, default: (s: any) => s },
    color: { type: String, default: 'gray' },
  },
  setup(props) {
    const colorStyleGenerator = (name: string) => {
      switch (name) {
        case 'red':
          return 'background:#FDE8E8;color:#9B1C1C;'
        case 'yellow':
          return 'background:#FDF6B2;color:#723B13;'
        case 'green':
          return 'background:#DEF7EC;color:#03543F;'
        case 'blue':
          return 'background:#E1EFFE;color:#1E429F;'
        case 'indigo':
          return 'background:#E5EDFF;color:#42389D;'
        default:
          return 'background:#F3F4F6;color:#111928;'
      }
    }
    return {
      ...toRefs(props),
      colorStyleGenerator,
    };
  },
});
export default ComTableCellBox;
</script>

<template lang="pug">
.com-table-cell-box.w-full.flex.justify-center
  .bg__wrapper.px-10px.py-2px.text-center(:style='`${colorStyleGenerator(color)}`')
    .text-xs.font-medium {{ handle(data.text) }}
</template>

<style lang="stylus" scoped>
.com-table-cell-box
  .bg__wrapper
    border-radius 6px
</style>
