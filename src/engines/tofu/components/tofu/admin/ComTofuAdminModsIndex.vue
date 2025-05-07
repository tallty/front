<script lang="ts">
import { defineComponent, toRefs, PropType, computed } from 'vue';
import { VStore } from '@/lib/vails';
import ComSettingCard from '@/engines/com/components/com/ComSettingCard.vue';
import { TofuMod } from '@/engines/tofu/model';
import { useRouter } from 'vue-router';

const ComTofuAdminModsIndex = defineComponent({
  name: 'ComTofuAdminModsIndex',
  components: {
    ComSettingCard,
  },
  props: {
    store: { type: Object as PropType<VStore>, required: true },
  },
  setup(props) {
    const router = useRouter();
    const template = {
      type: 'layout',
      model: {},
      key: 'layout_1620131537626_0',
      model_key: 'layout_1620131537626_0',
      fields: [
        {
          name: '普通布局',
          type: 'layout',
          fields: [
            {
              name: '模块名称',
              type: 'input',
              rules: [],
              model: { attr_type: 'string' },
              options: { span: 24 },
              key: 'input_1620131546408_2',
              model_key: 'name',
              fields: [],
              conditions: [],
              model_key_prefix: '',
            },
            {
              name: '地址 key',
              type: 'input',
              rules: [],
              model: { attr_type: 'string' },
              options: { span: 24 },
              key: 'input_1620131546408_2',
              model_key: 'key',
              fields: [],
              conditions: [],
              model_key_prefix: '',
            },
          ],
          options: { span: 24, label: { width: 80, align: 'left' } },
          key: 'layout_1620131545041_1',
          model_key: 'layout_1620131545041_1',
          conditions: [],
          model_key_prefix: '',
        },
      ],
      conditions: [],
    };

    const config = computed(() => ({
      recordName: '模块名',
      store: props.store,
      pagination: { perPage: 160 },
      actions: {
        create: true,
      },
      template: template,
      list: {
        splitCount: 8,
      },
    }));

    const onShow = (record: TofuMod) => {
      router.push(`/tofu/admin/pc/mods/${record.id}/entries`);
    };

    return {
      ...toRefs(props),
      config,
      onShow,
    };
  },
});

export default ComTofuAdminModsIndex;
</script>

<template lang="pug">
.com-tofu-admin-mods-index
  TaTitleHeader(title='模块配置')
  TaIndexView(:config='config' @onShow='onShow')
    template(#card='{ record, actions }')
      .box
        .card
          ComSettingCard(:name='record.name')
          .setting
            a-dropdown.dropdown(:trigger="['click']")
              a.setting.text-gray(@click.stop="e => e.preventDefault()")
                TaIcon(type="SettingOutlined")
              template(#overlay)
                a-menu
                  a-menu-item(@click="actions.onEdit(record)")
                    .flex
                      TaIcon(type="EditOutlined")
                      .icon-text 编辑
                  a-menu-item
                    TaPopoverConfirm(title='删除', content='您确认删除该模块吗？', @confirm='actions.onDelete(record)')
                      .flex
                        TaIcon(type="DeleteOutlined")
                        .icon-text 删除
</template>

<style lang="stylus" scoped>
.com-tofu-admin-mods-index
  height 100%
  width 100%
  .box
    margin-bottom 20px
    .card
      width 130px
      margin 0 auto
      position relative
    .setting
      display none
      position absolute
      top 5px
      right 5px
    &:hover
      .setting
        display block
.icon-text
  margin-left 10px
</style>
