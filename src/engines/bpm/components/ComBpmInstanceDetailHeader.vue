<script lang="ts">
import qrCode from '@/engines/bpm/assets/images/qr_code.png';
import waiting from '@/engines/bpm/assets/images/waiting.png';
import { VObject } from '@/lib/vails';
import { message } from 'ant-design-vue';
import Clipboard from 'clipboard';
import QrCode from 'qrcode';
import { PropType, defineComponent, onMounted, ref, toRefs } from 'vue';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import { Instance } from '../bpm-core/types';

const ComBpmInstanceDetailHeader = defineComponent({
  name: 'ComBpmInstanceDetailHeader',
  components: {},
  props: {
    record: { type: Object as PropType<InstanceModel & Instance>, required: true },
    scroll: { type: Boolean, default: false },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const closeClick = () => {
      emit('close');
    };
    const copy = () => {
      const clipboard = new Clipboard('#seq');
      clipboard.on('success', () => {
        message.success('复制成功');
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on('error', () => {
        // 不支持复制
        console.log('该浏览器不支持自动复制');
        // 释放内存
        clipboard.destroy();
      });
    };
    const taskSeq = (record: VObject) => {
      return record.seq;
    };

    const qrCodeURL = ref('');

    onMounted(async () => {
      qrCodeURL.value = await QrCode.toDataURL(
        `${process.env.VUE_APP_DOMAIN}/short/instances/${props.record.id}`,
      );
    });

    return {
      ...toRefs(props),
      qrCode,
      waiting,
      closeClick,
      copy,
      taskSeq,
      qrCodeURL,
    };
  },
});
export default ComBpmInstanceDetailHeader;
</script>

<template lang="pug">
.com-bpm-instance-detail-header
  a-tooltip
    img.img-qr-code(:src='qrCode')
    template(#title)
      img.w-30.h-30(:src='qrCodeURL')
  #seq.number-box.cursor-pointer(:data-clipboard-text='taskSeq(record)', @click='copy')
    .number {{ record.seq }}
    .label 编号
  .scroll-box(:class='scroll ? "is-scroll" : "not-scroll"')
    .scroll-main
    .scroll-main
      .title {{ record.title }}
      .wait(v-if='record.current_token?.state === "processing"')
        img.wait-img(:src='waiting')
        span.text 等待{{ record.operatorDesc }}处理
  TaIcon(@click='closeClick', type='CloseOutlined', :style='{ color: "#a6a6a6" }')
</template>
<style lang="stylus" scoped>
.com-bpm-instance-detail-header
  display flex
  height 55px
  align-items center
  padding 0 30px
  overflow hidden
  .img-qr-code
    width 16px
    height 16px
    margin-right 26px
  .number-box
    display flex
    border-radius 4px
    border 1px solid #1890FF
    overflow auto
    margin-right 24px
    font-size 12px
    .number
      padding 0 12px
      height 24px
      border-radius 4px 0 0 4px
      line-height 24px
      background rgba(24, 144, 255, 0.2)
      color #1890FF
    .label
      width 34px
      height 24px
      background #1890FF
      line-height 24px
      text-align center
      color #FFFFFF
  .scroll-box
    flex 1
    height 55px
    width 100%
    margin-right 10px
    transition all 0.5s ease 0s
    position relative
    .scroll-main
      display flex
      height 55px
      align-items center
      .title
        font-size 18px
        color #262626
        font-weight bold
        margin-right 26px
      .wait
        display flex
        align-items center
        .wait-img
          width 16px
          height 16px
          margin-right 10px
        .text
          color #FA8C15
          font-size 14px
  .is-scroll
    top -55px
  .not-scroll
    top 0px
</style>
