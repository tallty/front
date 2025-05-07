<script lang="ts">
import { ref, defineComponent, toRefs } from 'vue';
import wx from '@tybys/jweixin';
import { IFile } from '@/components/global/ta-component/file/file';
import FileServer from '@/components/global/ta-component/file/servers';
import audio from '@/components/global/ta-component/file/assets/icons/sound_32.svg';
import video from '@/components/global/ta-component/file/assets/icons/video_32.svg';
import attachment from '@/components/global/ta-component/file/assets/icons/attachment_32.svg';
import { message } from 'ant-design-vue';

const EnginesBpmUserFilesNew = defineComponent({
  name: 'EnginesBpmUserFilesNew',
  components: {},
  props: {},
  setup(props) {
    const value = ref([]);
    const uploader = ref<any>(null);
    const pending = ref(true);

    const onUpload = () => {
      pending.value = false;
      uploader.value?.clickFileInput();
    };

    const fileServer = new FileServer({});

    const typeMap = {
      image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp', 'svg'],
      video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
      audio: ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'],
    };

    const iconPath = {
      audio,
      video,
      attachment,
    };

    const onConfirm = () => {
      if (loading.value) {
        message.error('文件正在上传中，请稍后再试');
        return;
      }
      wx.miniProgram.postMessage({ data: value.value });
      wx.miniProgram.navigateBack();
    };

    const getThumbnailUrl = (fileItem: IFile) => {
      const { fileType } = fileItem;
      if (typeMap.image.includes(fileType)) {
        return fileServer.getThumbnailUrl(fileItem, 64, 64);
      }
      if (typeMap.video.includes(fileType)) {
        return iconPath.video;
      }
      if (typeMap.audio.includes(fileType)) {
        return iconPath.audio;
      }
      return iconPath.attachment;
    };

    const visiblePreview = ref(false);
    const activeFileItem = ref<IFile | null>(null);

    const onPreview = (fileItem: IFile) => {
      activeFileItem.value = fileItem;
      visiblePreview.value = true;
    };

    const fileKey2ProgressMap = ref<Record<string, number>>({});

    const onProgressRender = (fileItem: IFile) => {
      fileKey2ProgressMap.value[fileItem.fileKey] = fileItem.percent;
    };

    const loading = ref(false);

    const startUpload = () => (loading.value = true);
    const onFileUploaderAllSettle = () => (loading.value = false);

    return {
      ...toRefs(props),
      value,
      uploader,
      onConfirm,
      onUpload,
      pending,
      getThumbnailUrl,
      visiblePreview,
      activeFileItem,
      onPreview,
      fileKey2ProgressMap,
      onProgressRender,
      startUpload,
      onFileUploaderAllSettle,
    };
  },
});
export default EnginesBpmUserFilesNew;
</script>

<template lang="pug">
.engines-bpm-user-files-new.h-full.w-full.flex.flex-col.items-center.justify-center.px-4.bg-gray-50
  template(v-if='pending')
    .flex.flex-col.items-center(class='w-8/10')
      img.w-full.mb-10(src='https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/public/web_development.png')
      .button.w-fit.px-8.bg-primary.text-base.font-medium.flex.items-center(
        @click='onUpload'
      )
        TaIcon.w-6.h-6(type='outline/cursor-click')
        .ml-2.py-2 选择文件
      .m-14

  .flex.flex-col.items-center.w-full.h-full(v-show='!pending')
    TaFileUploader.w-full.flex-grow.h-0(
      ref='uploader',
      v-model:value='value',
      :options='{ fileSize: 200 }'
      @preview='onPreview',
      @progress='onProgressRender',
      @start='startUpload',
      @allSettle='onFileUploaderAllSettle',
    )
      .empty
      template(#attachments='{ fileItems, actions }')
        .w-full.space-y-2
          .file-item-shell(
            v-for='fileItem in fileItems',
          )
            .file-item.p-2.px-4.rounded.bg-white.shadow.w-full.flex(
              :class='fileItem.status',
            )
              TaIcon.text-red-500.h-4.w-4.flex-shrink-0.mr-2.mt-1(v-if='fileItem.status === "error"', type='solid/x-circle')
              img.h-4.w-4.rounded.flex-shrink-0.mr-2.mt-1(v-else, :src='getThumbnailUrl(fileItem)')
              .content.flex-grow.w-0
                .name.flex.border-b.border-gray-200.pb-2.mb-2
                  .file-name.flex-grow.w-0.truncate
                    | {{ fileItem.fileName }}
                  .reupload.flex.items-center.ml-2(v-if='fileItem.status === "error"')
                    TaIcon.h-4.w-4.text-gray-500(type='outline/refresh', @click='actions.start(fileItem)')

                .actions.flex.flex-end.px-2.space-x-6
                  .preview-button.flex.items-center(@click.stop='actions.preview(fileItem)')
                    TaIcon.h-4.w-4.text-gray-500(type='solid/eye')
                    .ml-1 查看
                  .delete-button.flex.items-center(@click.stop='actions.remove(fileItem)')
                    TaIcon.h-4.w-4.text-gray-500(type='outline/trash')
                    .ml-1 删除
            a-progress(
              v-if='fileItem.status === "doing"',
              :percent='fileKey2ProgressMap[fileItem.fileKey]',
              :strokeColor='fileItem.percent === 100 ? "#52c41a" : "#1890ff"',
              :status='fileItem.percent === 100 ? "success" : "active"',
              :showInfo='false',
              :strokeWidth='6',
            )
    .space-x-4.bg-white.py-2.w-full.flex-shrink-0.flex.justify-around
      .border-gray-200.border.text-gray-800.button.flex-grow(@click='onUpload') 上传
      .bg-primary.button.flex-grow(type='primary', @click='onConfirm') 确定

  TaFilePreviewer(
    v-model:visible='visiblePreview',
    :attachment='activeFileItem',
    :attachmentList='value',
  )
</template>

<style lang="stylus" scoped>
.engines-bpm-user-files-new
  width 100% !important
  padding-bottom 40px
  padding-bottom calc(constant(safe-area-inset-bottom) + 40px)
  padding-bottom calc(env(safe-area-inset-bottom) + 40px)

.error
  .name
    @apply text-red-500

.w-fit
  width fit-content

.bg-primary
  background-color $primary-color
  color white

.button
  @apply rounded-xl flex justify-center py-2
</style>
