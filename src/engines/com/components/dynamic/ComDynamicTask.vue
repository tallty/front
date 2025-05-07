<template lang="pug">
.div.dynamic_task_wrapper.cursor-pointer
  a-popover(
    :placement='placement',
    v-model:visible='visible',
    trigger='click',
    :getPopupContainer='el => el?.parentNode'
  )
    template(#content)
      .w-96.h-125(:class='pcs')
        .w-90.h-121.rounded-lg.bg-white.border-1.border-gray-100.shadow-md
          .h-12.px-4.flex.flex-row.items-center.justify-between.border-b-1.border-gray-200
            .text-gray-900.text-sm.font-medium 文件传输
            .flex.items-center
              TaIcon.w-5.h-5.text-gray-400.cursor-pointer(
                type='outline/x',
                @click.stop='() => (visible = false)'
              )
          .w-90.h-109.px-3.py-2(v-if='visible')
            TaIndexView(:config='config', :showHeader='false')
              template(#header)
                .w-0.h-0
              template(#card='{ record }')
                .w-full.px-2.py-4.flex.flex-row.items-center.jsutify-between.border-b-1.border-gray-100
                  .w-0.flex-grow
                    .w-full.flex.items-center
                      .w-0.flex-grow.flex.items-center
                        img.w-5.h-5.mr-2(
                          :src='getFileFType({ fileType: record?.result?.fileType })'
                        )
                        .w-0.flex-grow
                          .w-full.ellipsis-2.text-sm.font-medium.text-gray-900 {{ record.name }}
                      .w-13.ml-2.h-21px.rounded-full.flex.items-center.justify-center(
                        :class='getDownload(record).css_name',
                        v-if='record.state !== "completed"'
                      ) {{ getDownload(record).name_value }}
                    .w-full.flex.items-center.text-xs.text-gray-500.mt-1
                      .text-xs.mr-4 {{ fileSize(record.result?.byte_size) }}
                      .text-xs {{ dayjs(record.updated_at).format('YYYY-MM-DD HH:mm:ss') }}
                  a-spin(v-if='downloadingId === record.id', size='small', spinning)
                    template(#indicator)
                      TaIcon.ant-spin-dot-item.ml-2.text-primary.w-5.h-5.cursor-pointer(
                        type='loading'
                      )
                  TaIcon.ml-2.text-primary.w-5.h-5(
                    v-else-if='record.state === "completed"',
                    :class='{ "cursor-pointer": !downloadingId, "cursor-not-allowed opacity-50": downloadingId }',
                    type='flowbite-outline/download',
                    @click.stop='download(record)'
                  )
                  TaTooltip(v-if='record.state === "terminated"', title='此文件已过期')
                    TaIcon.ml-2.text-gray-400.w-5.h-5(type='flowbite-outline/exclamation-circle')
    .div.w-full.h-full(@click.stop='openTask')
      slot
        .flex.items-center.justify-center.w-8.h-8.bg-primary.rounded-full.relative
          TaIcon.text-white(type='flowbite-outline/download')
</template>
<script lang="ts">
import { ComUserDynamicTasksApi } from '@/engines/com/apis/com/task/task.api';
import { VStore } from '@/lib/vails';
import { computed, defineComponent, PropType, ref, toRefs } from 'vue';
// import { useCable } from '@/engines/base/channels/useCable';
import { getFileFType } from '@/engines/com/com-core/utils/getFileType';
import dayjs from 'dayjs';

const ComDynamicTask = defineComponent({
  name: 'ComDynamicTask',
  components: {},
  props: {
    // 为right时，在右侧显示，需要padding-left以制造更大的间隔区域，为left时在左侧显示，padding-right以制造更大的间隔区域
    placement: { type: String as PropType<'right' | 'left'>, default: () => 'right' },
    // 底部贴边，底部padding制造更大的间隔区域，上部贴边，上部padding制造更大的间隔区域
    isBottom: { type: Boolean, default: () => true },
  },
  setup(props) {
    const visible = ref(false);

    const downloadingId = ref<string | null>(null);
    const openTask = () => {
      visible.value = !visible.value;

      // 如果打开了面板，立即加载任务列表
      if (visible.value) {
        store
          .index()
          .then(res => {
            console.log('获取到任务列表:', res);
          })
          .catch(err => {
            console.error('获取任务列表失败:', err);
          });
      }
    };
    const pcs = computed(() => {
      const lrcss = props.placement === 'right' ? 'pl-6' : 'pr-6';
      const tbcss = props.isBottom ? 'pb-4' : 'pt-4';
      return `${lrcss} ${tbcss}`;
    });
    const store = new VStore(new ComUserDynamicTasksApi());

    // useCable(store, { callback: { afterCreate: () => store.index() } });
    const config = computed(() => ({
      recordName: '',
      store,
      // pagination: {
      //   perPage: 15,
      //   showPageSizeChanger: false,
      //   showSizeChanger: false,
      // }
      mode: 'list',
      // editApi:
      // showCount: true,

      list: {
        scroll: { y: 'auto' },
      },
      showCount: false,
      scrollLoading: true,
      // selection: {
      //   showByDefault: false;
      //   showSwitch: false;
      // };
    }));
    // pending: 排队中，processing: 处理中，complete: 已完成，failed: ,以失败 terminated: 已失效
    const getDownload = (record: any) => {
      let name_value = '';
      let css_name = '';
      if (record.state === 'pending') {
        name_value = '排队中';
        css_name = 'text-blue-600 bg-blue-50';
      }
      if (record.state === 'processing') {
        name_value = '处理中';
        css_name = 'text-blue-600 bg-blue-50';
      }
      if (record.state === 'completed') {
        name_value = '已完成';
        css_name = 'text-gray-500 bg-gray-100';
      }
      if (record.state === 'failed') {
        name_value = '已失败';
        css_name = 'text-red-500 bg-red-50';
      }
      if (record.state === 'terminated') {
        // 根据消息内容区分是否是过期导致的终止
        if (record.result?.message && record.result.message.includes('已被自动清理')) {
          name_value = '已过期';
          css_name = 'text-gray-500 bg-gray-100';
        } else {
          name_value = '已失效';
          css_name = 'text-orange-500 bg-orange-50';
        }
      }
      return {
        name_value,
        css_name,
      };
    };

    const download = async (record: any) => {
      if (downloadingId.value) return; // 如果有文件正在下载，直接返回
      downloadingId.value = record.id;
      try {
        // 检查是否有URL
        if (!record.result?.url) {
          console.error('文件URL不存在', record);
          return;
        }

        // 检查文件是否有过期信息
        if (record.result?.message && record.result.message.includes('已被自动清理')) {
          alert('此文件已过期，请重新导出');
          return;
        }

        // 使用fetch下载文件，这样可以带上认证信息
        const response = await fetch(record.result.url, {
          credentials: 'include', // 带上认证信息
        });

        if (!response.ok) {
          throw new Error(`下载失败: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${record.name}.${record.result.fileType}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('下载文件失败', error);
        alert('下载文件失败，请查看控制台了解详情');
      } finally {
        downloadingId.value = null;
      }
    };

    const fileSize = (size: number) => {
      if (!size) return '';
      if (size < 1024 * 1024) return `${Math.ceil(size / 1024).toFixed(1)} Kb`;
      return `${Math.ceil(size / (1024 * 1024)).toFixed(1)} MB`;
    };

    return {
      ...toRefs(props),
      visible,
      openTask,
      pcs,
      config,
      getFileFType,
      dayjs,
      getDownload,
      download,
      fileSize,
      downloadingId,
    };
  },
});
export default ComDynamicTask;
</script>
<style lang="stylus" scoped>
.dynamic_task_wrapper
  :deep(.ant-popover)
    z-index 999 !important
    .ant-popover-arrow
      display none !important
    .ant-popover-inner
      border-radius 0px
      box-shadow none
      background transparent
    .ant-popover-inner-content
      padding 0 !important
</style>
