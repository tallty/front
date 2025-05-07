import { VModel, VObject } from '@/lib/vails/model/index';
import { VStore } from '@/lib/vails/store/index';
import { cloneDeep } from 'lodash-es';
import { Ref, computed, ref, watch } from 'vue';
import { BpmUserInstances, InstanceModel } from './apis/user/instance.api';
import { BpmUserTokens } from './apis/user/token.api';
import { Token, TokenPlace, TokenTypes } from './types';
import { FormSetting } from '@/components/global/ta-component/ta-template-form-core/data_form/form_setting';

const useTokenFire = (
  action: Ref<string>,
  actionFlag: Ref<string | undefined>,
  actionZh: Ref<string>,
  callback: { success: () => void; fail: (message?: string) => void },
  specificInstanceStore?: VStore,
  specificTokenStore?: VStore,
) => {
  const instanceStore =
    specificInstanceStore || new VStore(new BpmUserInstances(), InstanceModel as any);
  const tokenStore = specificTokenStore || new VStore(new BpmUserTokens());

  const formRecord = ref<any>(null);
  const currentToken = computed(() => {
    return {
      ...instanceStore.record.value.current_token,
      // token_source: instanceStore.record.value.current_token.token_source || {},
      // token_payload: instanceStore.record.value.current_token.token_payload || {},
      data_form_payload: instanceStore.record.value.current_token.data_form_payload || {},
    };
  });
  const comment = ref('');
  const needNextPlace = computed(() => ['reject', 'fail'].includes(action.value));

  const nextPlaceId = ref<number | undefined>(undefined);

  watch(
    [
      () => {
        return instanceStore.record.value.historyPlaceOptions?.[0]?.value;
      },
      action,
    ],
    () => {
      nextPlaceId.value = needNextPlace.value
        ? instanceStore.record.value.historyPlaceOptions[0]?.value
        : undefined;
    },
  );
  const nextTokenIds = ref<number[]>([]);

  const onUpdateNextPlaceId = () => {
    const item = instanceStore.record.value.historyPlaceOptions?.find(
      (item: VObject) => item.value === nextPlaceId.value,
    );
    if (item) {
      nextTokenIds.value = item.tokenOptions.map((i: VObject) => i.value);
    }
  };

  const operator = ref<{
    operator_id?: string;
    operator_name?: string;
    operator_mobile?: string;
  }>({});
  const needOperator = ['forward'].includes(action.value);

  const placeFormSteps = computed(() => {
    const targetId = currentToken.value.place_id;

    const tokenPlace = instanceStore.record.value.token_places?.find(
      (tokenPlace: TokenPlace) => tokenPlace.place.id === targetId,
    );

    // const steps = [
    //   {
    //     type: 'form',
    //     bindKey: 'token_payload',
    //     form: tokenPlace?.place?.place_form || {},
    //   },
    //   {
    //     title: '填写表单',
    //     type: 'form',
    //     bindKey: 'token_source',
    //     form: tokenPlace?.token_source_template?.form || {},
    //   },
    // ].filter((step) => ((step.form as any)?.fields || []).length > 0);
    const steps = tokenPlace?.place?.form_setting
      ? new FormSetting(tokenPlace.place.form_setting).steps
      : [];
    return steps;
  });

  const setupFormRecord = async () => {
    formRecord.value = new VModel(
      cloneDeep(currentToken.value),
      tokenStore as any,
      cloneDeep(currentToken.value),
    );

    formRecord.value.save = async () => {
      if (needOperator && !operator.value.operator_id) {
        callback.fail && callback.fail(`您还未选择${actionZh.value}人`);
        return Promise.reject();
      }

      if (formRecord.value.configCache.onTemporaryStorage) {
        try {
          await formRecord.value.update(
            { data_form_payload: formRecord.value.formData.data_form_payload },
            // {
            // token_payload: formRecord.value.formData.token_payload,
            // token_source: VModel.diff(
            //   formRecord.value.token_source,
            //   formRecord.value.formData.token_source,
            // ),
            // }
          );
          callback.success && callback.success();
        } catch {
          callback.fail && callback.fail();
        }
        return;
      }

      if (nextPlaceId.value && nextTokenIds.value?.length < 1) {
        callback.fail && callback.fail('您还未选择节点');
        return Promise.reject();
      }

      await tokenStore
        .sendMemberAction({
          id: currentToken.value.id,
          action: 'fire',
          config: {
            data: {
              token: {
                action: action.value,
                action_flag: actionFlag.value,
                comment: comment.value,
                next_place_id: nextPlaceId.value,
                token_ids: nextTokenIds.value,
                user_id: operator.value.operator_id,
                user_ids: userIds.value,
                user_type: 'User', // 兼容老版本
                operator_type: 'User', // 兼容老版本
                operator_id: operator.value.operator_id, // 兼容老版本

                data_form_payload: formRecord.value.formData.data_form_payload,
                // token_payload: formRecord.value.formData.token_payload,
                // token_source: VModel.diff(
                //   formRecord.value.tokenxi_source,
                //   formRecord.value.formData.token_source,
                // ),
              },
            },
          },
        })
        .then(() => callback.success && callback.success())
        .catch(error => {
          callback.fail && callback.fail(error);
          throw error;
        });
    };
  };

  const needForm = computed(
    () =>
      placeFormSteps.value.length > 0 &&
      ['submit', 'complete'].includes(action.value) &&
      [TokenTypes.Approval, TokenTypes.Handle].includes(currentToken.value.type),
  );

  const userIds = ref<number[]>([]);

  return {
    formRecord,
    setupFormRecord,
    instanceStore,
    tokenStore,
    currentToken,
    comment,
    nextPlaceId,
    nextTokenIds,
    onUpdateNextPlaceId,
    operator,
    placeFormSteps,
    needNextPlace,
    needForm,
    userIds,
  };
};

export default useTokenFire;
