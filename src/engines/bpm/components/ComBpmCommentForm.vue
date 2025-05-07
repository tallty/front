<script lang="ts">
import { message } from 'ant-design-vue';
import { computed, defineComponent, ref, toRefs } from 'vue';
import { bpmCommentTemplate } from './template';

const ComPlanCommentForm = defineComponent({
  name: 'ComPlanCommentForm',
  components: {},
  props: {
    visible: { type: Boolean, default: false },
    record: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const localVisible = computed({
      get: () => props.visible,
      set: val => emit('update:visible', val),
    });

    const form = ref<any>(null);

    const onConfirm = () => {
      form.value?.submit().then(() => {
        message.success('评论成功');
        localVisible.value = false;
        emit('afterSave');
      });
    };

    return {
      ...toRefs(props),
      bpmCommentTemplate,
      localVisible,
      form,
      onConfirm,
    };
  },
});

export default ComPlanCommentForm;
</script>

<template lang="pug">
TaNoPaddingModal(
  v-model:visible='localVisible',
  title='添加评论',
  :bodyStyle='{ overflow: "auto", height: "fit-content" }',
  :modalContentStyle='{ "border-radius": "0.75rem", overflow: "hidden" }',
  width='50vw',
  @cancel='() => (localVisible = false)',
  @ok='onConfirm'
)
  .overflow-y-auto.form-shell
    TaTemplateForm.comment-form.h-fit.px-6(
      ref='form',
      :template='bpmCommentTemplate',
      :record='record'
    )
</template>

<style lang="stylus" scoped>
.form-shell
  max-height 70vh
.comment-form
  >>> .label-text
    text-align left
</style>
