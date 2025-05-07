<script lang="ts">
import { VStore } from '@/lib/vails';
import { defineComponent, onMounted, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { BpmUserApprovingInstances } from '../bpm-core/apis/user/approving/instance.api';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import { Instance } from '../bpm-core/types';
import ComBpmInstanceDetailEasyDialogFromIndex from './ComBpmInstanceDetailEasyDialogFromIndex.vue';

const ComBpmInstanceNews = defineComponent({
  name: 'ComBpmInstanceNews',
  components: {
    ComBpmInstanceDetailEasyDialogFromIndex,
  },
  props: {},
  setup(props) {
    const selectedInstance = ref<any>(null);
    const store = new VStore(new BpmUserApprovingInstances(), InstanceModel);
    const visibleInstance = ref(false);

    const fetchData = () => {
      store.index({ per_page: 5 });
    };

    onMounted(() => {
      fetchData();
    });

    const onShowInstance = (instance: Instance) => {
      selectedInstance.value = instance;
      visibleInstance.value = true;
    };

    const router = useRouter();

    const onMore = () => {
      router.push('/bpm/user/instances');
    };

    const onDialogClose = () => {
      fetchData();
    };

    return {
      ...toRefs(props),
      selectedInstance,
      onShowInstance,
      records: store.records,
      store: store,
      visibleInstance,
      onDialogClose,
      onMore,
    };
  },
});
export default ComBpmInstanceNews;
</script>

<template lang="pug">
.com-bpm-insance-news
  .container
    .buttons
      .review.flex-between
        .left-part
          .image-circle
            //- img(src='@/assets/icons/review_blue.png')
          p 待办
        .right-part
          .text-circle {{ store.totalCount.value }}
    .instances
      .instance(v-for='instance in records', @click='onShowInstance(instance)')
        //- img.tofu-image(v-if='getInfo(instance.type).image', :src='getInfo(instance.type).image')
        //- img.tofu-image(src='@/assets/icons/tofu_placeholder.png')
        .content
          .tofu-info.flex-between
            //- .tofu-title.text-gray(v-if='getInfo(instance.type).name') {{ getInfo(instance.type).name }}
            .tofu-title.text-gray 业务流程申请
            .time.text-gray {{ instance.createdStr }}
          .body {{ instance.workflow_name }}
      .more
        TaTextButton.text-gray(icon='EllipsisOutlined', @click='onMore') 更多
    ComBpmInstanceDetailEasyDialogFromIndex(
      v-if='visibleInstance',
      v-model:visible='visibleInstance',
      :instance='selectedInstance'
      @close='onDialogClose'
    )
</template>

<style lang="stylus" scoped>
.com-bpm-insance-news
  padding 10px 24px
  .buttons
    margin 10px 0
    .left-part
      display flex
      align-items center
    .right-part
      .text-circle
        width 20px
        height 20px
        border-radius 50%
        background-color white
        color #3DA8F5
        text-align center
        font-weight 500
        font-size 12px
        line-height 20px
    .review
      padding 10px 12px
      width 100%
      height 48px
      border-radius 8px
      background-color #3DA8F5
      color white
      .image-circle
        display flex
        justify-content center
        align-items center
        margin-right 6px
        width 28px
        height 28px
        border-radius 14px
        background white
        -moz-border-radius 14px
        -webkit-border-radius 14px
        img
          width 14px
          height 14px
  .instances
    .instance
      display flex
      padding 16px 15px 16px 0
      border-bottom 1px solid #E5E5E5
      cursor pointer
      // &:hover
      // margin-left 10px
      // transition 0.5s
      .tofu-image
        margin-right 4px
        width 20px
        height 20px
      .content
        width 100%
        .tofu-info
          width 100%
          .tofu-title
            font-size 14px
  .more
    margin 16px 0
    .text-gray
      margin 0
      color #808080
</style>
