<script lang="ts">
import { PropType, computed, defineComponent, onMounted, ref, toRefs, watch } from 'vue';
import ComBpmInstanceDetailHeader from './ComBpmInstanceDetailHeader.vue';
import ComBpmInstanceDetailInfo from './ComBpmInstanceDetailInfo.vue';

import { VStore } from '@/lib/vails';
import { VObject } from '@/lib/vails/model';
import { NotifyUserCommentsApi } from '../apis/notify/user/comments.api';
import { BpmUserInstances, InstanceModel } from '../bpm-core/apis/user/instance.api';
import ComBpmInstanceActions from './ComBpmInstanceActions.vue';
import ComBpmInstanceDetailContent from './ComBpmInstanceDetailContent.vue';
import ComBpmInstanceTimeSpend from './ComBpmInstanceTimeSpend.vue';
import ComBpmInstanceTimeline from './ComBpmInstanceTimeline.vue';

const ComBpmInstanceDetail = defineComponent({
  name: 'ComBpmInstanceDetail',
  components: {
    ComBpmInstanceDetailHeader,
    ComBpmInstanceDetailInfo,
    ComBpmInstanceDetailContent,
    ComBpmInstanceTimeline,
    ComBpmInstanceActions,
    ComBpmInstanceTimeSpend,
  },
  props: {
    instanceId: { type: Number, required: true },
    store: { type: Object as PropType<VStore>, default: null },
  },
  emits: ['close', 'print'],
  setup(props, { emit }) {
    const scrollRef = ref(null);
    const scroll = ref(false);

    const innerStore = props.store || new VStore(new BpmUserInstances(), InstanceModel as any);

    onMounted(() => {
      window.addEventListener('scroll', handleScroll, true);
    });

    watch(
      () => props.instanceId,
      () =>
        innerStore.find(props.instanceId).then(() => {
          commentStore.api = new NotifyUserCommentsApi({
            formData: {
              commentable_type: 'Bpm::Instance',
              commentable_id: props.instanceId,
            },
            params: {
              q: {
                commentable_type_eq: 'Bpm::Instance',
                commentable_id_eq: props.instanceId,
              },
            },
          });
          commentStore.index({ per_page: 999999 });
        }),
      { immediate: true },
    );

    const handleScroll = () => {
      const scrollTop = (scrollRef.value as any)?.scrollTop;
      if (scrollTop && scrollTop > 84) {
        scroll.value = true;
      } else {
        scroll.value = false;
      }
    };

    const onClose = () => {
      emit('close');
    };

    const onPrint = () => {
      emit('print');
    };

    const tokens = computed(() => {
      return innerStore.record.value.token_places
        .map((token_places: VObject) => {
          return token_places.tokens;
        })
        .flat();
    });

    const commentStore = new VStore(
      new NotifyUserCommentsApi({
        formData: {
          commentable_type: 'Bpm::Instance',
          commentable_id: props.instanceId,
        },
        params: {
          q: {
            commentable_type_eq: 'Bpm::Instance',
            commentable_id_eq: props.instanceId,
          },
        },
      }),
    );
    const customAction = {
      complete:
        '例如：我对您的方案非常感兴趣，但方案描述比较简洁，期待进一步交流，请于一周内通过平台【站内信】或电话*********联系我。',
      terminate: '例如：您好，经评估，该方案与需求不匹配，感谢您的投递。',
    };
    const showActions = computed(() => {
      return process.env.VUE_APP_APP_CODE === 'TECH';
    });

    return {
      ...toRefs(props),
      scrollRef,
      handleScroll,
      scroll,
      record: innerStore.record,
      tokens,
      onClose,
      onPrint,
      innerStore,
      commentStore,
      loading: innerStore.loading,
      customAction,
      showActions,
    };
  },
});
export default ComBpmInstanceDetail;
</script>

<template lang="pug">
.bpm-instance-detail-spinning.w-full.h-full
  a-spin.w-full.h-full.items-center.justify-center(:spinning='loading', class='!flex')
    .com-bpm-instance-detail(v-if='record.id')
      .header
        ComBpmInstanceDetailHeader(:scroll='scroll', :record='record', @close='onClose')
      .main-box
        .item.left-item(ref='scrollRef')
          .init-header
            ComBpmInstanceDetailInfo(:record='record')
          .init-main
            ComBpmInstanceDetailContent(:record='record')
        .item.right-item.flex.flex-col
          slot(name='statistic', :instance='record', :formatedTokens='tokens')
            ComBpmInstanceTimeSpend(:instance='record', :formatedTokens='tokens')
          ComBpmInstanceTimeline.flex-grow(:record='record', :commentStore='commentStore', class='!h-0')
      .footer
        ComBpmInstanceActions(
          :actions='record.enableActions',
          :store='innerStore',
          :commentStore='commentStore',
          @close='onClose',
          @print='onPrint',
          :customAction='showActions ? customAction: undefined'
        )
</template>

<style lang="stylus" scoped>
.bpm-instance-detail-spinning
  >>> .ant-spin-nested-loading
    height 100%
  >>> .ant-spin-container
    height 100%
.com-bpm-instance-detail
  width 100%
  height 100%
  border 1px solid #D9D9D9
  border-radius 12px
  .header
    height 55px
    width 100%
    border-bottom 1px solid #D9D9D9
  .main-box
    height calc(100% - 130px)
    display grid
    grid-template-columns 2fr 1fr
    overflow hidden
    .item
      .init-header
        height 83px
        border-bottom 1px solid #D9D9D9
    .left-item
      overflow auto
    .right-item
      overflow auto
      border-left 1px solid #D9D9D9
  .footer
    width 100%
    height 75px
    // overflow hidden
    background white
    border-top 1px solid #D9D9D9
    border-radius 0 0 12px 12px
</style>
