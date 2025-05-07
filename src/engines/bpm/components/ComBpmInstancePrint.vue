<script lang="ts">
import wx from '@tybys/jweixin';
import { message } from 'ant-design-vue';
import domtoimage from 'dom-to-image-more';
import { defineComponent, getCurrentInstance, onMounted, ref, toRefs } from 'vue';
import ComBpmInstanceDetailContent from './ComBpmInstanceDetailContent.vue';
import ComBpmInstanceDetailInfo from './ComBpmInstanceDetailInfo.vue';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import FileServer from '@/components/global/ta-component/file/servers';

const ComBpmInstancePrint = defineComponent({
  name: 'ComBpmInstancePrint',
  components: {
    ComBpmInstanceDetailInfo,
    ComBpmInstanceDetailContent,
  },
  props: {
    record: { type: Object, default: () => ({}) },
    needPostMessage: { type: Boolean, default: false },
  },
  setup(props) {
    const component = ref('');
    const instance = getCurrentInstance() as any;
    const componentName = `BpmInstanceDetailInfoFor${props.record.workflow_id}`;
    const componentIsExist = instance.appContext?.components[componentName];
    component.value = componentIsExist ? componentName : '';

    const printProcess = ref(true);
    const changeProcessPrint = () => {
      printProcess.value = !printProcess.value;
    };

    const onPrint = () => {
      window.print();
    };

    const pageRef = ref<any>(null);
    const img = ref('');

    onMounted(() => {
      setTimeout(() => {
        if (props.needPostMessage) {
          domtoimage
            .toPng(pageRef.value, { quality: 2 })
            .then((dataUrl: any) => {
              setTimeout(() => {
                wx.miniProgram.postMessage({ data: dataUrl });
                img.value = dataUrl;
                wx.miniProgram.navigateBack();
              });
            })
            .catch((error: any) => {
              message.error('error: ', error);
              console.error('oops, something went wrong!', error);
            });
        }
      }, 2000);
    });

    const fileServer = new FileServer();
    const onUploadTemplateWord = async () => {
      try {
        const files = props.record.conf?.files;
        if (!files || !files?.length) return message.error('没有找到模板文件');

        const templateUrl = fileServer.getDownloadUrl(files[0])
        console.log(templateUrl, '111')
        // 获取模板文件
        const response = await fetch(templateUrl, {
          mode: 'cors'
        });
        console.log(response, '222')
        if (!response.ok) {
          throw new Error('获取模板失败');
        }

        const arrayBuffer = await response.arrayBuffer();

        try {
          // 加载模板
          const content = arrayBuffer;
          const zip = new PizZip(content);
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true
          });

          // 准备变量数据
          const data = props.record;

          // 渲染模板
          doc.render(data);

          // 生成新的文档
          const out = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          });

          // 下载文件
          const url = window.URL.createObjectURL(out);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `${props.record.title || '审批单'}.docx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          message.success('模板处理成功');
        } catch (error: any) {
          console.error('处理模板失败:', error);
          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors.map((e: any) => e.properties.explanation).join('\n');
            message.error(`模板错误: ${errorMessages}`);
          } else {
            message.error('处理模板失败，请检查模板格式');
          }
        }
      } catch (error) {
        console.error('获取模板失败:', error);
        message.error('获取模板失败，请重试');
      }
    }

    return {
      ...toRefs(props),
      onPrint,
      printProcess,
      changeProcessPrint,
      pageRef,
      img,
      component,
      onUploadTemplateWord,
    };
  },
});
export default ComBpmInstancePrint;
</script>

<template lang="pug">
.com-bpm-instances-print.w-full.h-full
  //- .mark.h-screen.w-screen.bg-white.z-100.fixed(v-if='needPostMessage')
  //- img.mark.h-screen.w-screen.bg-white.z-100.fixed(:src='img')
  .print-actions.w-full.flex-end(class='print:!hidden')
    TaTextButton(icon='PrinterOutlined', @click='onUploadTemplateWord')
      | 模板打印
    TaTextButton(icon='PrinterOutlined', @click='onPrint')
      | 立即打印
    .print-box(v-if='!component')
      TaTextButton(v-if='printProcess', icon='EyeOutlined', @click='changeProcessPrint')
        | 打印流程
      TaTextButton(v-else, icon='EyeInvisibleOutlined', @click='changeProcessPrint')
        | 不打印流程

  .print-page.bg-white.w-300.mx-auto.py-4.px-12.shadow-xl.divide-gray-300.divide-y(ref='pageRef')
    component(v-if='component', :is='component', :record='record', :showQrcode='true', class='!pb-0')
    .container(v-else)
      ComBpmInstanceDetailInfo.mt-4(:record='record', :showQrcode='true', class='!pb-0')
      ComBpmInstanceDetailContent(
        :record='record',
        :expendedAll='true',
        :showSteps='false',
        :closeClone='true'
      )
      .module.pl-3(v-if='printProcess')
        .title.text-gray-900.text-lg.font-bold 审批记录
        table.border-collapse.tokens-table.mt-2.w-full
          tr.tokens-tr
            td.p-2.py-2(
              v-for='(title, index) in ["顺序", "标题", "审核结果", "审批人", "审核描述", "审批时间"]',
              :key='index'
            )
              | {{ title }}
          tr(v-for='(token, index) in record.printableTokens', :key='index')
            td.p-2 {{ index + 1 }}
            td.p-2 {{ token.name }}
            td.p-2 {{ record.stateInfo.label }}
            td.p-2 {{ token.operator_name || '—' }}
            td.p-2 {{ token.comment }}
            td.p-2 {{ token.updatedStr.value }}
</template>
<style lang="stylus">
.com-bpm-instances-print
  // 防止 dom-to-image 出灰色边框
  *, ::after, ::before
    border-style none
    border-color white
    box-sizing border-box
</style>

<style lang="stylus" scoped>
.print-page
  .tokens-table
    table, tr, td
      border 1px solid black !important
  >>> .com-bpm-instance-detail-content
    .steps
      .finish
        border-style solid
  >>> .viewer
    background none
    padding-top 0
  >>> .ta-template-form-field
    *
      font-size 1rem
      line-height 1.25rem
  >>> .ta-template-form-theme-card__card__shell
    display none
@media print
  .com-bpm-instances-print
    height auto
    width 100%
    .print-actions
      display none
    .print-page
      margin 0 auto
      width 100%
      padding 0
      box-shadow none
    >>> .ta-template-form-field
      // .thumbnail
      // height 10px
</style>
