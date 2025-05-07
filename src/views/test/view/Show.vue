<script lang="ts">
import { ref, defineComponent, computed } from 'vue';
import ComScreenDesigner from '@/engines/screen/components/designer/ComScreenDesigner.vue';
import dayjs from 'dayjs';
import ComFigmaRender from '@/engines/screen/components/ComFigmaRender.vue';
import ComFigmaDrawer from '@/engines/screen/components/ComFigmaDrawer.vue';

export default defineComponent({
  name: '',
  components: {
    ComScreenDesigner,
    ComFigmaRender,
    ComFigmaDrawer,
  },
  setup() {
    const orgId = 100;
    const date = ref(dayjs());
    const yearDate = computed(() => {
      return date.value.format('YYYY-MM-DD');
    });

    const value = ref({
      dataSource: [],
      screenConfiguration: {
        flatData: [
          // {
          //   key: '1',
          //   name: 'bg',
          //   parent_key: 'root',
          //   cssc: { z: 1, w: 1000, h: 1000 },
          //   component: 'TaLayer',
          //   props: {
          //     url:
          //       'https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/party-build-mobile/large-screen/bg5.png',
          //   },
          // },
          // {
          //   key: 'b123',
          //   name: 'kv',
          //   parent_key: 'root',
          //   cssc: { z: 2, w: 300 },
          //   component: 'TaScreenKeyValue',
          //   props: {
          //     label: '机关事业单位在职党员报到数',
          //     dataSource: '1',
          //     dataIndex: 'data.0.机关事业单位在职党员报到数',
          //   },
          // },
        ],
      },
    });

    const schemaConfig = ref({
      treeStruct: {},
      flatData: [
        { name: 'root', key: 'root', parent_key: null, index: 1 },
        // {
        //   key: 'a123',
        //   component: 'TaChartImage',
        //   name: '图片 1',
        //   parent_key: 'root',
        //   props: {
        //     url:
        //       'https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/party-build-mobile/IMG_8364.JPG',
        //   },
        //   index: 1,
        //   cssc: {
        //     x: 100,
        //     y: 100,
        //   },
        // },
        // {
        //   key: 'b123',
        //   name: '图层2',
        //   parent_key: 'root',
        //   cssc: { zIndex: 2 },
        //   props: {
        //     url: 'https://stiei-obs2.obs.myhuaweicloud.com/party-build-mobile/WechatIMG680.jpeg',
        //   },
        //   component: 'TaLayer',
        // },
        // {
        //   key: 'c123',
        //   component: 'TaChartImage',
        //   cssc: {
        //     w: 50,
        //     h: 50,
        //     zIndex: 3,
        //   },
        //   parent_key: 'b123',
        //   props: {
        //     url:
        //       'https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/party-build-mobile/IMG_8364.JPG',
        //   },
        //   name: '图片 2',
        // },
      ],
    });
    return {
      value,
      schemaConfig,
    };
  },
});
</script>

<template lang="pug">
//- .list {{ value }}
ComScreenDesigner(v-model:value='value')
//-
//- ComFigmaDrawer(v-model:value='schemaConfig')
</template>

<style lang="stylus">
.list
  color red
</style>
