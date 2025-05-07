<script lang="ts">
import waiting from '@/engines/bpm/assets/images/waiting.png';
import QrCode from 'qrcode';
import { PropType, defineComponent, onMounted, ref, toRefs } from 'vue';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import { Instance } from '../bpm-core/types';
import ComBpmLevelTag from './ComBpmLevelTag.vue';
// https://www.npmjs.com/package/qrcode

const ComBpmInstanceDetailInfo = defineComponent({
  name: 'ComBpmInstanceDetailInfo',
  components: {
    ComBpmLevelTag,
  },
  props: {
    record: { type: Object as PropType<InstanceModel & Instance>, required: true },
    showQrcode: { type: Boolean, default: false },
  },
  setup(props) {
    const identity = (textarr: string[]) => {
      let text = '';
      if (textarr) {
        textarr.map((item: any) => {
          text = text + item + ' ';
        });
      }
      return text;
    };

    const qrCodeURL = ref('');

    onMounted(async () => {
      qrCodeURL.value = await QrCode.toDataURL(
        `${process.env.VUE_APP_DOMAIN}/short/instances/${props.record.id}`,
      );
    });

    return {
      ...toRefs(props),
      waiting,
      identity,
      qrCodeURL,
    };
  },
});
export default ComBpmInstanceDetailInfo;
</script>

<template lang="pug">
.com-bpm-instance-detail-info.flex
  .container-left.flex-grow.w-0
    .header.flex
      ComBpmLevelTag.mr-2.level(v-if='record.level', :value='record.level', :options='record.level_options')
      .title.whitespace-nowrap
        | {{ record.title }}
      .time.whitespace-nowrap
        | {{ record.createdStr }}
    .info-main.flex.flex-grow.w-0
      span.user-tab.flex
        .tab 单号：
        .data {{ record.seq }}
      span.user-tab.flex
        .tab 账号：
        .data {{ record.creator_user.account }}
      span.user-tab.flex.flex-grow.w-0
        .tab 部门：
        .data.truncate {{ identity(record.creator_user?.department_names) }}
  .container-right(v-if='record.current_token?.state === "processing" && !showQrcode')
    img.wait-img(:src='waiting')
    .status 等待{{ record.operatorDesc }}处理
  .container-right(v-else-if='showQrcode')
    img.w-30.h-30(:src='qrCodeURL')
</template>

<style lang="stylus" scoped>
.flex
  display flex
  justify-content flex-start
.com-bpm-instance-detail-info
  align-items center
  font-family PingFangSC-Regular, PingFang SC
  width 100%
  height 100%
  // min-width 670px
  padding 20px 36px 20px 24px
  width 100%
  .container-left
    // width 100%
    // flex 1
    margin-right 20px
    .header
      margin-bottom 12px
      align-items center
      .title
        font-size 18px
        font-weight 600
        color #262626
        line-height 25px
        margin-right 36px
        min-width 260px
        text-overflow ellipsis
        overflow hidden
        white-space nowrap
      .time
        font-size 14px
        color #8c8c8c
        line-height 14px
    .info-main
      width 100%
      .user-tab
        // width fit-content
        margin-right 30px
        .tab, .data
          margin-right 4px
          font-size 14px
          font-family PingFangSC-Regular, PingFang SC
          font-weight 400
          color rgba(89, 89, 89, 0.65)
          display block
        .tab
          white-space nowrap
    .details
      .work-number
        font-size 14px
        color #8c8c8c
        line-height 14px
        margin-right 16px
      .specialty
        font-size 14px
        color #8c8c8c
        line-height 14px
  .container-right
    display flex
    justify-content flex-end
    flex-shrink 0
    .wait-img
      width 16px
      height 16px
      margin-right 10px
    .status
      font-size 14px
      color #FA8C15
      line-height 20px
</style>
