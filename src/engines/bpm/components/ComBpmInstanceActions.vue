<script lang="ts">
import { VStore } from '@/lib/vails';
import { VObject } from '@/lib/vails/model';
import { message, Modal } from 'ant-design-vue';
import { computed, defineComponent, onMounted, PropType, ref, toRefs } from 'vue';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import { Instance, PlaceTypes, Token, TokenAction } from '../bpm-core/types';
import useTokenFire from '../bpm-core/useTokenFire';
import ComBpmActionButtons from './ComBpmActionButtons.vue';
import ComPlanCommentForm from './ComBpmCommentForm.vue';
import { useInstanceActionAuthInject } from './useInstanceActionAuth';

const ComBpmInstanceActions = defineComponent({
  name: 'ComBpmInstanceActions',
  components: {
    ComBpmActionButtons,
    ComPlanCommentForm,
  },
  props: {
    actions: { type: Array as PropType<TokenAction[]>, default: () => [], required: true },
    store: { type: Object as PropType<VStore<Instance>>, required: true },
    commentStore: { type: Object, required: true },
    limit: { type: Number, default: undefined },
    customAction: { type: Object, default: () => {} },
  },
  emits: ['success', 'fail', 'close', 'print'],
  setup(props, { emit }) {
    const buttonActions = computed(() => {
      const actions =
        props.actions?.map((action: TokenAction) => ({
          label: action.display || action.display_name || action.name,
          desc: action.desc,
          callback: action.callback || getActions(action),
          ...styleMapping[action.key],
        })) || [];

      return props.limit
        ? actions.splice(0, props.limit)
        : actions
            .concat(process.env.VUE_APP_BPM_HIDE_FIXED_ACTIONS ? [] : fixedButtonActions.value)
            .filter((i: any) => i?.label);
    });

    const { instanceCanDo } = useInstanceActionAuthInject();

    const canNotice = computed(() => {
      return (
        instance.value.currentPlaceToken?.token_state === 'processing' &&
        [
          PlaceTypes.Approval,
          PlaceTypes.ApprovalAssign,
          PlaceTypes.Handle,
          PlaceTypes.NotifyAssign,
        ].includes(instance.value.currentPlaceToken?.place?.type)
      );
    });

    const fixedButtonActions = computed(() => [
      {
        label: '评论',
        callback: onCommentCreate,
        ...styleMapping.comment,
      },
      canNotice.value
        ? {
            label: '催办',
            callback: onNotice,
            ...styleMapping.notice,
          }
        : {},
      instanceCanDo(instance.value as Instance, 'edit')
        ? {
            label: '超级编辑',
            callback: onSuperEdit,
            ...styleMapping.edit,
          }
        : {},
    ]);

    const instance = computed(() => props.store.record.value);

    const getActions = (action: TokenAction) => {
      if (action.key === 'edit')
        // return instance.value.instanceFlowableForm ? onEditFlowable : onEdit;
        return onEdit;
      if (action.key === 'assign') return onAssign(action);
      if (action.key === 'reassign') return onReassign(action);
      if (action.key === 'forward') return onForward(action);
      if (action.key === 'print') return onPrint;
      if (action.key === 'notice') return onNotice;
      return onFireCallback(action);
    };

    const activeAction = ref<Partial<TokenAction>>({});
    const visibleTokenForm = ref(false);
    const visibleComment = ref(false);
    const visibleInstanceForm = ref(false);
    const commentValid = ref(false);

    const commentPlaceHolder = ref('');

    const styleMapping: VObject = {
      submit: { color: '', icon: 'CheckCircleOutlined' },
      complete: { color: '', icon: 'CheckCircleOutlined' },
      print: { color: '', icon: 'PrinterOutlined' },
      edit: { icon: 'EditOutlined' },
      assign: { color: '', icon: 'RetweetOutlined' },
      reassign: { color: '', icon: 'RetweetOutlined' },
      forward: { color: '', icon: 'RetweetOutlined' },
      recall: { color: '', icon: 'RollbackOutlined' },
      reject: { color: '', icon: 'RollbackOutlined' },
      fail: { color: '', icon: 'StopOutlined' },
      terminate: { color: 'red', icon: 'StopOutlined' },

      comment: { colo: '', icon: 'MessageOutlined' },
      notice: { colo: '', icon: 'BellOutlined' },
    };

    const onEdit = () => {
      editable.value = true;
      visibleInstanceForm.value = true;
    };

    const onPrint = () => {
      emit('close');
      emit('print');
      const url = `/bpm/user/instances/${instance.value.id}/print`;
      if (process.env.VUE_APP_PUBLIC_PATH) {
        const publichPath = process.env.VUE_APP_PUBLIC_PATH.split('/')
          .filter((i: string | undefined) => i)
          .join('/');
        window.open(publichPath ? `/${publichPath}${url}` : `${url}`);
      } else {
        window.open(`${url}`);
      }
    };

    // const visibleInstanceFlowableForm = ref(false);
    // const flowableAttributes = ref<VObject>({});

    // const flowableRecord = ref<VObject>({});

    // watch(
    //   () => instance.value.flowable_info,
    //   () => {
    //     flowableRecord.value = new VModel(
    //       instance.value.flowable_info || {},
    //       new VStore(new VApi()),
    //     );
    //     flowableRecord.value.save = async () => {
    //       await tokenStore
    //         .sendMemberAction({
    //           id: instance.value.current_token.id,
    //           action: 'fire',
    //           config: {
    //             data: {
    //               token: {
    //                 action: 'edit',
    //                 flowable_attributes: flowableRecord.value.dirty(),
    //               },
    //             },
    //           },
    //         })
    //         .then(() => {
    //           // message.success('操作成功');
    //           emit('success');
    //         })
    //         .catch(() => {
    //           // message.error('操作失败');
    //           emit('fail');
    //         })
    //         .finally(() => {
    //           instance.value.fetch();
    //         });
    //     };
    //   },
    //   {
    //     immediate: true,
    //     deep: true,
    //   },
    // );

    // const onEditFlowable = () => {
    //   visibleInstanceFlowableForm.value = true;
    // };

    const visibleInstanceSuperEditForm = ref(false);

    const onSuperEdit = () => {
      editable.value = true;
      visibleInstanceSuperEditForm.value = true;
    };

    const assignNoDisplayField = ref<any>(null);
    const customAssignLimitIds = ref<number[]>([]);
    const assignLimitIds = computed(() => {
      return customAssignLimitIds.value.length > 0
        ? customAssignLimitIds.value
        : instance.value?.currentPlaceToken?.tokens?.[0]?.options?.user_ids || [];
    });

    const onAssign = (action: TokenAction) => {
      return () => {
        activeAction.value = action;
        assignNoDisplayField.value.open();
      };
    };

    const onReassign = (action: TokenAction) => {
      return () => {
        activeAction.value = action;
        // console.log(instance.value, 'instance.value.currentPlaceToken');
        // const allUserIds = instance.value?.current_token?.options?.user_ids || [];
        // const completeUserIds =
        //   instance.value.currentPlaceToken?.tokens
        //     ?.filter((token: Token) => token.state === 'completed')
        //     ?.map((token: Token) => token.operator_id) || [];

        // customAssignLimitIds.value = allUserIds.filter(
        //   (id: number) => !completeUserIds.includes(id),
        // );

        // instance.value.currentPlaceToken?.tokens?.map((token: Token) => token.operator_id) || [];
        assignNoDisplayField.value.open();
      };
    };

    const forwardNoDisplayField = ref<any>(null);

    const onForward = (action: TokenAction) => {
      return () => {
        activeAction.value = action;
        forwardNoDisplayField.value.open();
      };
    };

    // const visibleCustomComponent = ref(false);
    // const customComponent = ref('');

    const onFireCallback = (action: TokenAction) => {
      return async () => {
        activeAction.value = action;
        setupFormRecord();

        // if (
        //   instance.value.last_token_place?.place?.token_source_options?.options
        //     ?.complete_component &&
        //   action.key === 'complete'
        // ) {
        //   visibleCustomComponent.value = true;
        //   customComponent.value =
        //     instance.value.last_token_place.place.token_source_options.options.complete_component;
        // } else
        commentValid.value = false;
        commentPlaceHolder.value = '非必填';

        if (
          props?.customAction &&
          Object.keys(props.customAction).length > 0 &&
          (props.store.record?.value?.workflow_name === '技术成果对接' ||
            props.store.record?.value?.workflow_name === '技术需求对接')
        ) {
          const keys = Object.keys(props.customAction);
          console.log(keys);
          if (keys.includes(action.key)) {
            commentValid.value = true;
            commentPlaceHolder.value = props.customAction[action.key];
          }
        }

        if (['complete', 'submit'].includes(action.key) && !(await validateInstanceForm())) {
          onEditUncompletedInstanceForm();
        } else if (needForm.value) {
          editable.value = true;
          visibleTokenForm.value = true;
        } else {
          visibleComment.value = true;
        }
      };
    };

    const visibleCommentCreate = ref(false);
    const newCommentRecord = ref<VObject>({});

    const onCommentCreate = () => {
      newCommentRecord.value = props.commentStore.new();
      visibleCommentCreate.value = true;
    };

    const onCommentCreateConfirm = () => {
      // instance.value.fetch();
      props.commentStore.index({ per_page: 999999 });
    };

    const noticeNoDisplayField = ref<any>(null);
    const noticeTokenIds = ref<number[]>([]);

    const tokenTableItems = [
      {
        name: '用户名',
        type: 'string',
        search: true,
        data_index: 'operator_name',
      },
      {
        name: '节点',
        type: 'string',
        // search: true,
        data_index: 'name',
      },
    ];
    const noticeSelectableTokenIds = computed(
      () =>
        instance.value.currentPlaceToken?.tokens
          ?.filter((token: Token) => ['pending', 'preparing', 'processing'].includes(token.state))
          ?.map((token: Token) => token.id) || [],
    );

    const onNotice = () => {
      noticeTokenIds.value = [];
      noticeNoDisplayField.value.open();
    };

    const onNoticeOk = () => {
      props.store
        .sendMemberAction({
          id: instance.value.id!,
          action: 'remind',
          config: {
            data: {
              instance: {
                token_ids: noticeTokenIds.value,
              },
            },
          },
        })
        .then(() => {
          message.success(`催办成功`);
        })
        .catch(() => {
          message.error(`催办失败`);
        });
    };

    const actionStr = computed(() => activeAction.value.key!);
    const actionFlag = computed(() => activeAction.value.action_flag);
    const actionZh = computed(() => activeAction.value.display || activeAction.value.name!);

    const fireCallback = {
      success: () => {
        message.success('操作成功');
        onSuccess();
        typeof instance.value.fetch === 'function' && instance.value.fetch();
      },
      fail: (msg?: string) => {
        if (msg) message.error(msg);
        emit('fail');
      },
    };

    const {
      setupFormRecord,
      formRecord,
      placeFormSteps,
      comment,
      nextPlaceId,
      nextTokenIds,
      onUpdateNextPlaceId,
      needNextPlace,
      needForm,
      userIds,
      operator,
      tokenStore,
    } = useTokenFire(
      actionStr,
      actionFlag,
      actionZh,
      // save() 的回调
      fireCallback,
      props.store as any,
    );

    onMounted(() => setupFormRecord());

    const onSuccess = (opts?: { temporaryStorage: boolean }) => {
      emit('success');
      visibleComment.value = false;
      if (!opts?.temporaryStorage) {
        visibleTokenForm.value = false;
        visibleInstanceForm.value = false;
        visibleInstanceSuperEditForm.value = false;
      }
    };

    const onInputComment = () => {
      // comment.value = comment.value.slice(0, 200);
      // comment.value = comment.value.slice(0, 200);
    };

    const onCommentOk = () => {
      if (commentValid.value) {
        if (!comment.value) {
          return message.error('请填写留言');
        }
      }
      formRecord.value.save();
    };

    const onAssignOk = () => {
      // formRecord.value.save();
      customAssignLimitIds.value = [];
      visibleComment.value = true;
    };

    const onForwardOk = () => {
      // formRecord.value.save();
      visibleComment.value = true;
    };

    const tableItems = [
      {
        name: '用户名',
        type: 'string',
        search: true,
        data_index: 'name',
      },
      {
        name: '用户账号',
        type: 'string',
        search: true,
        data_index: 'account',
      },
    ];

    const editable = ref(true);
    // 没有找到很好的挂载在选定按钮上的方法,暂时使用这样的固定偏移方法
    const modalStyle = computed(() => {
      // if (['complete', 'submit'].includes(activeAction.value.key as string)) {
      //   return { top: '50vh', left: '20vw' };
      // }
      // return { top: '50vh' };
      return { top: '60vh', left: '15vw' };
    });

    const editFormSteps = computed(() => InstanceModel.getEditSteps(instance.value as any));

    const validateInstanceFormRef = ref<any>(null);

    const validateInstanceForm = () => {
      return (
        validateInstanceFormRef.value
          ?.validate()
          ?.then(() => true)
          ?.catch(() => false) || Promise.resolve(true)
      );
    };

    const onEditUncompletedInstanceForm = () => {
      Modal.confirm({
        title: '表单内容未填写完成，是否打开编辑？',
        okText: '前往填写',
        onOk: () => {
          visibleInstanceForm.value = true;
        },
      });
    };

    return {
      ...toRefs(props),
      activeAction,
      buttonActions,
      formRecord,
      comment,
      visibleTokenForm,
      visibleComment,
      visibleInstanceForm,
      onSuccess,
      record: props.store.record,
      onInputComment,
      onCommentOk,
      onAssignOk,
      nextPlaceId,
      needNextPlace,
      userIds,
      tableItems,
      operator,
      onForward,
      onForwardOk,
      assignNoDisplayField,
      forwardNoDisplayField,
      fixedButtonActions,
      visibleInstanceSuperEditForm,
      editable,
      getActions,
      tokenLoading: tokenStore.loading,
      // visibleInstanceFlowableForm,
      // flowableRecord,
      modalStyle,
      visibleCommentCreate,
      newCommentRecord,
      onCommentCreateConfirm,
      editFormSteps,
      placeFormSteps,
      // visibleCustomComponent,
      // customComponent,
      fireCallback,
      assignLimitIds,
      noticeNoDisplayField,
      noticeTokenIds,
      tokenTableItems,
      noticeSelectableTokenIds,
      onNoticeOk,
      nextTokenIds,
      onUpdateNextPlaceId,
      actionZh,
      validateInstanceFormRef,

      commentValid,
      commentPlaceHolder,
    };
  },
});
export default ComBpmInstanceActions;
</script>

<template lang="pug">
view.com-bpm-actions
  slot(:actions='buttonActions')
    ComBpmActionButtons(:actions='buttonActions')

  TaTemplateFormWithActionsDrawer(
    v-model:editable='editable',
    v-model:visible='visibleTokenForm',
    :steps='placeFormSteps',
    :editing='true',
    :record='formRecord',
    :canTemporaryStorage='true',
    :closeConfirm='true',
    :context='{ flowable_info: record.flowable_info, record: record.flowable_info, instance: record }',
    :isPlane='true',
    @success='onSuccess'
  )

  TaTemplateFormWithActionsDrawer(
    v-model:editable='editable',
    v-model:visible='visibleInstanceSuperEditForm',
    v-model:modelValue='record.formData',
    :steps='editFormSteps',
    :editing='true',
    :record='record',
    :context='{ flowable_info: record.flowable_info, record: record.flowable_info, instance: record }',
    :closeConfirm='true',
    :isPlane='true',
    @success='onSuccess'
  )

  TaTemplateFormWithActionsDrawer(
    v-model:editable='editable',
    v-model:visible='visibleInstanceForm',
    :steps='editFormSteps',
    :record='record',
    :editing='true',
    :canTemporaryStorage='true',
    :accessibility='record.accessibility',
    :closeConfirm='true',
    :isPlane='true',
    :context='{ flowable_info: record.flowable_info, record: record.flowable_info, instance: record }',
    okText='保存',
    @success='onSuccess'
  )

  //- 用于 complete 按钮验证表单是否完全填完
  TaTemplateFormWithActions.hidden(
    ref='validateInstanceFormRef',
    :steps='editFormSteps',
    :record='record',
    :context='{ flowable_info: record.flowable_info, record: record.flowable_info, instance: record }',
    :accessibility='record.accessibility'
  )

  //- TaTemplateFormWithActionsDrawer(
  //-   v-model:editable='editable',
  //-   v-model:visible='visibleInstanceFlowableForm',
  //-   :template='record.instanceFlowableForm',
  //-   :record='flowableRecord',
  //-   :canTemporaryStorage='false',
  //-   :closeConfirm='true',
  //-   @success='onSuccess'
  //- )

  //- component(
  //-   :is='customComponent',
  //-   v-model:visible='visibleCustomComponent',
  //-   :instance='record',
  //-   :token='record.current_token',
  //-   :formRecord='formRecord',
  //-   :callbacks='fireCallback'
  //- )

  a-modal(v-model:visible='visibleComment', :style='modalStyle', :title='actionZh')
    .comment-form
      .mb-4.w-full(v-if='needNextPlace')
        a-select.w-full(
          v-model:value='nextPlaceId',
          :options='record.historyPlaceOptions',
          placeholder='回到节点 (可选)',
          @update:value='onUpdateNextPlaceId'
        )
      .w-full
        a-textarea(v-model:value='comment', :placeholder='commentPlaceHolder', :rows='3')
        //- span.count {{ comment.length }}/200
      .w-full.mt-4(v-if='needNextPlace && nextPlaceId')
        a-checkbox-group.w-full(
          v-model:value='nextTokenIds',
          :options='record.historyPlaceOptions.find(item => item.value === nextPlaceId)?.tokenOptions || []',
          placeholder='退回人员'
        )
    template(#footer)
      .flex-end.w-full
        a-button(@click='() => (visibleComment = false)') 取消(N)
        a-button.ml-2(type='primary', @click='onCommentOk', :loading='tokenLoading') 提交(Y)

  TaApiNoDisplayField(
    ref='assignNoDisplayField',
    v-model:value='userIds',
    path='/res/member/users',
    recordName='执行人',
    :multiple='true',
    :tableItems='tableItems',
    :ransackStr='JSON.stringify({ id_in: assignLimitIds })',
    @ok='onAssignOk'
  )

  TaApiNoDisplaySingleField(
    ref='forwardNoDisplayField',
    v-model:value='operator.operator_id',
    path='/res/member/users',
    :recordName='`执行人`',
    :multiple='true',
    :tableItems='tableItems',
    :ransackStr='JSON.stringify({ id_in: record.current_token.options.user_ids })',
    @ok='onAssignOk'
  )

  TaApiNoDisplayField(
    ref='noticeNoDisplayField',
    v-model:value='noticeTokenIds',
    :path='`/bpm/user/instances/${record.id}/tokens`',
    :recordName='`执行人`',
    :multiple='true',
    :tableItems='tokenTableItems',
    :ransackStr='JSON.stringify({ id_in: noticeSelectableTokenIds })',
    @ok='onNoticeOk'
  )
  //- a-modal(v-model:visible='visibleForward', @ok='onForwardOk')
  //-   TaApiSingleField(
  //-     v-model:value='operator.operator_id',
  //-     path='/res/member/users',
  //-     :recordName='`${actionZh}人`'
  //-     :tableItems='tableItems'
  //-   )

  ComPlanCommentForm(
    v-model:visible='visibleCommentCreate',
    :record='newCommentRecord',
    @afterSave='onCommentCreateConfirm'
  )
</template>

<style lang="stylus">
.comment-form
  .title
    margin-bottom 8px
    color #333333
  .form
    position relative
    margin-bottom 10px
    .tips
      margin-bottom 10px
    .count
      position absolute
      right 10px
      bottom 14px
      color #999999
      font-size 12px
      user-select none
</style>
