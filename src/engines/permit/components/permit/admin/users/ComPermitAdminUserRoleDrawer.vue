<template lang="pug">
a-drawer(
  v-model:visible='visible',
  title='全部'
  width='700'
  :closeable='true'
  :footer-style='{textAlign: "center"}'
  @close="() => visible=false"
)
  .h-full.flex.flex-col
    .w-full.flex.flex-row.box-border.border-1.border-gray-100.bb-none.rounded-t-lg
      .w-34.h-11.px-4.py-3.box-border.rounded-tl-lg.bg-gray-100.bb-w.flex.items-center.justify-center.text-sm.font-medium.text-gray-900 模块
      .w-36.h-11.px-4.py-3.box-border.bg-gray-50.flex.items-center.justify-center.bb-w.text-sm.font-medium.text-gray-900 权限包
      .w-0.h-11.flex-grow.px-4.py-3.box-border.bb-g.text-sm.font-medium.text-gray-900.flex.items-center.justify-center 方法
    .h-0.flex-grow.overflow-y-scroll.w-full.border-1.border-gray-100.rounded-b-lg.bt-none.flex.flex-col 
      .flex.flex-row.items-center(v-for='item in showerPermissions')
        .w-34.px-4.py-3.box-border.bg-gray-100.bb-w.flex.items-center.text-sm.font-medium.text-gray-900.h-full {{ item.name }}
        .w-0.flex-grow.flex.flex-row.flex-col 
          .w-full.flex.flex-col(v-for='s_item in item.records')
            .w-full.flex.flex-row
              .w-36.px-4.py-3.box-border.bg-gray-50.flex.items-center.bb-w.text-sm.font-medium.text-gray-900.flex.flex-row.flex-wrap.break-all {{ s_item.name }}
              .w-0.flex-grow.flex.flex-wrap.box-border.bb-g.pb-4 
                .mx-4.mt-4( v-for='t_item in s_item.records') {{ t_item.aname }}
  template(#footer)
    a-button(type="primary" @click='() => visible=false') 关闭
</template>
<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';

const ComPermitAdminUserRoleDrawer = defineComponent({
  name: 'ComPermitAdminUserRoleDrawer',
  components: {},
  props: {
    showerPermissions: { type: Array, default: () => [] },
  },
  setup(props) {
    const visible = ref(false);
    return {
      ...toRefs(props),
      visible,
    };
  },
});
export default ComPermitAdminUserRoleDrawer;
</script>
<style lang="stylus" scoped></style>
