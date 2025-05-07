<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent, getCurrentInstance, nextTick, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

const ComWorkflowColorfulCard = defineComponent({
  name: 'ComWorkflowColorfulCard',
  components: {},
  props: {
    workflow: { type: Object, required: true },
    creator: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const updateTimeHidden = process.env.VUE_APP_WORKFLOW_UPDATE_TIME_HIDDEN === 'true';
    const createInstance = () => {
      emit('createInstance');
    };

    const { proxy } = getCurrentInstance() as any;

    const fireAction = (action: 'star' | 'unstar', zh: string) => {
      props.workflow
        .fireAction(action)
        .then(() => {
          nextTick(() => proxy.$forceUpdate());
          message.success(`${zh}成功`);
          emit('fresh');
        })
        .catch(() => {
          message.error(`${zh}失败`);
        });
    };

    return {
      ...toRefs(props),
      createInstance,
      fireAction,
      updateTimeHidden,
      t,
    };
  },
});
export default ComWorkflowColorfulCard;
</script>

<template lang="pug">
.com-workflow-colorful-card
  .head.flex
    TaColorfulIcon.icon(:config='{ icon: "HomeFilled" }')
    .text
      a-tooltip(:title='workflow.name')
        .name {{ workflow.name }}
      .catalog {{ workflow.catalog_name }}
  .body
    .desc
      .desc-text.flex
        span {{ t('bpm.user.workflow.desc') }}：
        a-tooltip(:title='workflow.desc')
          span {{ workflow.desc }}
      .desc-text(v-if='!updateTimeHidden') 更新时间：{{ workflow.updatedAtStr }}
    .actions.flex-between
      .liked.flex-start(v-if='workflow.star_by_user', @click='fireAction("unstar", "取消收藏")')
        TaIcon.icon(type='StarFilled', size='12px')
        | 已收藏
      .like.flex-start(v-else, @click='fireAction("star", "收藏")')
        TaIcon.icon(type='StarOutlined', size='12px')
        | 收藏

      a-button.button(type='primary', size='small', @click='createInstance') 发起
</template>

<style lang="stylus" scoped>
.com-workflow-colorful-card
  overflow hidden
  background #EFF3FD
  border-radius 8px
  padding 4px
  width calc(100% - 16px)
  margin-left 16px
  margin-bottom 20px
  .head
    width 100%
    padding 8px
    .icon
      margin-right 12px
    .text
      width 100%
      .name
        width calc(100% - 60px)
        overflow hidden
        font-size 14px
        font-weight 500
        color rgba(38, 38, 38, 0.85)
        white-space nowrap
        text-overflow ellipsis
        height 20px
      .catalog
        font-size 12px
        font-weight 400
        color rgba(89, 89, 89, 0.65)
  .body
    background white
    padding 3px 8px
    .desc
      padding 4px 0 12px
      border-bottom 1px solid rgba(239, 243, 253, 1)
      font-size 12px
      font-weight 400
      color rgba(89, 89, 89, 0.65)
      line-height 20px
      .desc-text
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
    .actions
      padding 12px 0
      font-size 12px
      .liked
        .icon
          color #F8B862
      .like, .liked
        cursor pointer
        .icon
          margin-right 4px
          margin-top 2px
      .button
        font-size 12px
</style>
