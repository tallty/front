import { MyApi } from '@/apis/MyApi';
import { DataForm } from '@/components/global/ta-component/ta-template-form-core/data_form/data_form';
import { FormSetting } from '@/components/global/ta-component/ta-template-form-core/data_form/form_setting';
import { DataFormInterface } from '@/components/global/ta-component/ta-template-form-core/data_form/types';
import {
  TaTemplateFormItem,
  TaTemplateFormStepsStep,
} from '@/components/global/ta-component/ta-template-form-core/types';
import useProcessFields from '@/components/global/ta-component/ta-template-form-core/useProcessFields';
import { VModel } from '@/lib/vails';
import { VApiConfig } from '@/lib/vails/api';
import { VObject } from '@/lib/vails/model/index';
import { VStore } from '@/lib/vails/store/index';
import dayjs from 'dayjs';
import { cloneDeep, get, uniqBy } from 'lodash-es';
import { personTitle } from '../../../utils/index';
import {
  Instance,
  PlaceTypes,
  Token,
  TokenPlace,
  TokenPlaceInfo,
  TokenTypes,
  Workflow,
} from '../../types';
import { WorkflowModel, getWorkflowLevelSteps } from '../admin/workflow.api';
import { PlaceModel } from './place.api';
import { BpmUserTokens, TokenModel } from './token.api';

const { getFormAllAccessibilityHidden } = useProcessFields();

export class BpmUserInstances extends MyApi<Instance> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/user',
      name: 'instance',
      actions: [
        { method: 'post', name: 'statistic', on: 'collection' },
        { method: 'post', name: 'remind', on: 'member' },
      ],
      ...config,
    });
  }
}

export class InstanceModel extends VModel<Instance> {
  createdDate = this.computedAttr('createdDate', () =>
    dayjs(this.reactiveRecord.created_at).format('YYYY/MM/DD'),
  );

  creator = this.computedAttr('creator', () =>
    personTitle(
      this.reactiveRecord.creator_id,
      this.reactiveRecord.creator_name || this.reactiveRecord.creator_user?.account,
    ),
  );

  currentOperator = this.computedAttr('currentOperator', () =>
    personTitle(
      this.reactiveRecord.current_token.operator_id,
      this.reactiveRecord.current_token.operator_name,
    ),
  );

  title = this.computedAttr(
    'title',
    () => `${this.creator.value}发起的${this.reactiveRecord.workflow_name}`,
  );

  operatorDesc = this.computedAttr('operatorDesc', () => {
    if (!this.reactiveRecord.last_token_place) {
      return '';
    }
    const lastTokenPlace = this.reactiveRecord.last_token_place;

    if (lastTokenPlace.token_state !== 'processing') {
      return '';
    }

    // if (lastTokenPlace.place.layout_options?.hidden_name) {
    //   return '';
    // }

    const operators = lastTokenPlace.tokens
      .filter(token => token.state === 'processing')
      .map(token => personTitle(token.operator_id, token.operator_name));

    // “我” 排第一个
    if (operators.findIndex(name => name === '我') > 0) {
      operators.unshift('我');
    }

    // 去重
    const result = operators.filter(
      (name, index) => operators.findIndex(n => n === name) === index,
    );
    if (result.length > 3) {
      return `${result.slice(0, 3).join('、')}等${result.length}人`;
    }

    return result.join('、');
  });

  // 工作流实例的状态图标
  stateIcon = this.computedAttr('stateIcon', () => {
    if (this.reactiveRecord.state === 'terminated') {
      return 'https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/estate/noPass.png';
    } else if (this.reactiveRecord.state === 'completed') {
      return 'https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/estate/completion.jpg';
    } else {
      return 'https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/estate/underReview.png';
    }
  });

  static stateMap(t?: any): VObject {
    return {
      all: { value: '', label: t ? t('bpm.state.all') : '全部' },
      created: {
        value: 'created',
        label: t ? t('bpm.state.all') : '待提交',
        type: 'info',
        color: '#CCCCCC',
        style: {
          background: '#F3F4F6',
          color: '#4B5563',
        },
      },
      preparing: {
        value: 'preparing',
        label: t ? t('bpm.state.preparing') : '待处理',
        type: 'info',
        color: '#CCCCCC',
        style: {
          background: '#F3F4F6',
          color: '#4B5563',
        },
      },
      processing: {
        value: 'processing',
        label: t ? t('bpm.state.processing') : '进行中',
        type: 'primary',
        color: '#1890ff',
        style: {
          background: '#E1EFFE',
          color: '#1C64F2',
        },
      },
      completed: {
        value: 'completed',
        label: t ? t('bpm.state.completed') : '已完成',
        type: 'success',
        color: '#15bc83',
        style: {
          background: '#DEF7EC',
          color: '#057A55',
        },
      },
      checked: {
        value: 'checked',
        label: t ? t('bpm.state.checked') : '审核通过',
        type: 'success',
        color: '#15bc83',
      },
      received: {
        value: 'received',
        label: t ? t('bpm.state.received') : '已收件',
        type: 'success',
        color: '#15bc83',
      },
      rejected: {
        value: 'rejected',
        label: t ? t('bpm.state.rejected') : '已驳回',
        type: 'warning',
        color: '#f29851',
      },
      failed: {
        value: 'failed',
        label: t ? t('bpm.state.failed') : '已退回',
        type: 'warning',
        color: '#f5222d',
      },
      canceled: {
        value: 'canceled',
        label: t ? t('bpm.state.canceled') : '已取消',
        type: 'warning',
        color: '#f5222d',
      },
      terminated: {
        value: 'terminated',
        label: t ? t('bpm.state.terminated') : '已终止',
        type: 'danger',
        color: '#f5222d',
        style: {
          background: '#FDE8E8',
          color: '#F05252',
        },
      },
    };
  }

  stateInfo = this.computedAttr(
    'stateInfo',
    () => InstanceModel.stateMap(this.store?.extra?.t)[this.reactiveRecord.state],
  );

  summaryAry = this.computedAttr('summaryAry', () => {
    const summaryObj = this.reactiveRecord.summary || {};
    return Object.keys(summaryObj).map(key => {
      const value = summaryObj[key];
      // 检查是否是ISO格式的时间字符串
      const formattedValue = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
        ? dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        : value;
      return [key, formattedValue].join('：');
    });
  });

  flowableSummaryAry = this.computedAttr('flowableSummaryAry', () => {
    const flowableSummaryObj = this.reactiveRecord.flowable_summary || {};
    return Object.keys(flowableSummaryObj).map(key => [key, flowableSummaryObj[key]].join('：'));
  });

  createdStr = this.computedAttr('createdStr', () =>
    dayjs(this.reactiveRecord.created_at).format('YYYY/MM/D HH:mm'),
  );

  lastProcessAt = this.computedAttr('lastProcessAt', () =>
    this.reactiveRecord.action_at
      ? dayjs(this.reactiveRecord.action_at).format('YYYY/MM/D HH:mm')
      : '',
  );

  // 如果 accessibility 判断后的表单都为 hidden，则隐藏 编辑按钮
  enableActions = this.computedAttr('enableActions', () => {
    return this.reactiveRecord.enable_actions.filter(
      action =>
        !(
          action.key === 'edit' &&
          // getFormAllAccessibilityHidden(
          //   this.reactiveRecord.form,
          //   this.reactiveRecord.payload,
          //   this.accessibility.value,
          // ) &&
          InstanceModel.getEditSteps(this.reactiveRecord as Instance & InstanceModel).every(
            (step: TaTemplateFormStepsStep) => {
              return step.form
                ? getFormAllAccessibilityHidden(
                    step.form as TaTemplateFormItem, // 后端返回的都是完整 form
                    typeof get(this.reactiveRecord, step.bindKey || 'none') === 'object'
                      ? (get(this.reactiveRecord, step.bindKey || 'none') as VObject)
                      : {},
                    [],
                  )
                : true;
            },
          )
        ),
    );
  });

  stepsInfo = this.computedAttr('stepsInfo', () => {
    return {
      current_index: this.reactiveRecord.places?.findIndex(
        place => place.id === this.reactiveRecord.current_token.place_id,
      ),
      places: this.reactiveRecord.places,
    };
  });

  // instanceFlowableForm = this.computedAttr('instanceFlowableForm', () => {
  //   return this.reactiveRecord.model_setting?.ref_model_setting_form || null || null;
  //   1;
  // });

  placeTokensFormatted = this.computedAttr('placeTokensFormatted', () => {
    const store = new VStore(new BpmUserTokens());
    // console.log(this.reactiveRecord.token_places, 'this.reactiveRecord.token_places');

    return (
      this.reactiveRecord.token_places
        ?.filter(item => item.place.type !== PlaceTypes.Route)
        ?.map(item => ({
          ...item,
          place: new PlaceModel(cloneDeep(item.place), store as any),
          tokens: item.tokens.map(token => new TokenModel(cloneDeep(token), store as any)),
        })) || []
    );
  });

  handleableTokens = this.computedAttr('handleableTokens', () => {
    const store = new VStore(new BpmUserTokens());
    return this.reactiveRecord.token_places?.reduce((out, place) => {
      return out.concat(
        place.tokens
          .filter(token => token.handleable)
          .map(token => new TokenModel(cloneDeep(token), store as any)),
      );
    }, [] as TokenModel[]);
  });

  printableTokens = this.computedAttr('printableTokens', () => {
    const store = new VStore(new BpmUserTokens());
    return this.reactiveRecord.token_places?.reduce((out, place) => {
      return out.concat(
        place.tokens
          .filter(token => token.handleable || token.type === TokenTypes.Notify)
          .map(token => new TokenModel(cloneDeep(token), store as any)),
      );
    }, [] as TokenModel[]);
  });

  currentPlaceToken = this.computedAttr('currentPlaceToken', () => {
    const currentPlaceId = this.reactiveRecord.current_token.place_id;
    return [...(this.reactiveRecord.token_places || [])].reverse().find(tokenPlace => {
      return tokenPlace.place.id === currentPlaceId;
    });
  });

  currentPlace = this.computedAttr('currentPlace', () => {
    // const currentPlaceId = this.reactiveRecord.current_token.place_id;
    // let place = null;
    // this.reactiveRecord.token_places?.forEach(tokenPlace => {
    //   if (tokenPlace.place.id === currentPlaceId) {
    //     place = tokenPlace.place;
    //   }
    // });
    return this.currentPlaceToken.value?.place;
  });

  accessibility = this.computedAttr('accessibility', () => {
    return this.currentPlace.value?.fields?.fields || [];
  });

  historyPlaceOptions = this.computedAttr('historyPlaceOptions', () =>
    this.reactiveRecord.token_places
      ? this.reactiveRecord.token_places
          .filter((item: TokenPlace) => item.token_state === 'completed' && item.tokens?.length > 0)
          .filter(
            (item, index) =>
              this.reactiveRecord.token_places
                .filter((item: TokenPlace) => item.token_state === 'completed')
                .findIndex(i => i.place.id === item.place.id) === index &&
              (item.place.type === PlaceTypes.Approval ||
                item.place.type === PlaceTypes.StartPlace),
          )
          .map(item => {
            const tokenOperatorId2LastCreatedAt: Record<number, string> = {};
            const tokenOptions = uniqBy(
              // 去重且合并所有的 tokenPlace 的可选 tokens
              this.reactiveRecord.token_places
                .filter((i: TokenPlace) => i.place.id === item.place.id && i.tokens?.length > 0)
                .map((i: TokenPlace) =>
                  i.tokens
                    .filter((token: Token) => token.state === 'completed')
                    .map((token: Token) => {
                      if (!tokenOperatorId2LastCreatedAt[token.operator_id])
                        tokenOperatorId2LastCreatedAt[token.operator_id] = token.created_at;
                      tokenOperatorId2LastCreatedAt[token.operator_id] = dayjs(
                        token.created_at,
                      ).isAfter(tokenOperatorId2LastCreatedAt[token.operator_id])
                        ? token.created_at
                        : tokenOperatorId2LastCreatedAt[token.operator_id];
                      return {
                        value: token.id,
                        label: token.operator_name,
                        operatorId: token.operator_id,
                        createAt: token.created_at,
                      };
                    }),
                )
                .reduce((a, b) => a.concat(b), []),
              (a: VObject) => a.value,
            ).filter((item: VObject) => {
              // 过滤掉，同一个人，同一个节点，只保留最新的 token
              return dayjs(item.createAt).isSame(tokenOperatorId2LastCreatedAt[item.operatorId]);
            });

            return {
              value: item.place.id,
              label: `【${dayjs(item.tokens[item.tokens.length - 1].created_at).format(
                'YYYY-MM-DD HH:mm',
              )}】${item.place.name}`,
              tokenOptions,
            };
          })
      : // 旧版本，tokens
        this.reactiveRecord.tokens
          ?.filter(
            token =>
              token.place_id &&
              token.state === 'completed' &&
              ['Tokens::Approval', 'Tokens::Submit'].includes(token.type),
          )
          ?.map(token => ({
            value: token.place_id,
            label: `【${token.operator_name}】${token.name}`,
          })) || [],
  );

  startToken = this.computedAttr('startPlace', () => {
    return this.reactiveRecord.token_places?.[0]?.tokens?.[0];
  });

  tokenPlaceUniqPlaceData = this.computedAttr('tokenPlaceUniqPlaceData', () => {
    const mapping: Record<string, { tokenPlace: TokenPlace; index: number }> = {};
    this.reactiveRecord.token_places?.forEach((item: TokenPlace, index: number) => {
      mapping[item.place.id] = { tokenPlace: item, index };
    });

    return Object.values(mapping)
      .sort((a, b) => a.index - b.index)
      .map(item => item.tokenPlace);
  });

  tokenPlaceUniqPlaceLastData = this.computedAttr('tokenPlaceUniqPlaceLastData', () => {
    return (this.reactiveRecord.token_place_infos || []).map((info: TokenPlaceInfo) => {
      const existsTokenPlace = this.tokenPlaceUniqPlaceData.value.find(
        (tokenPlace: TokenPlace) => tokenPlace.place.id === info?.id,
      );

      const allTokensOfPlace = (this.reactiveRecord.token_places || [])
        .filter((tokenPlace: TokenPlace) => {
          return tokenPlace.place.id === info?.id;
        })
        .map((tokenPlace: TokenPlace) => tokenPlace.tokens)
        .reduce((a, b) => a.concat(b), []);

      return {
        ...existsTokenPlace,
        ...info,
        tokens: allTokensOfPlace.filter((token: Token) => info.token_ids.includes(token.id)),
      };
    });
  });

  dataForms = this.computedAttr('dataForms', () => {
    return (this.reactiveRecord.data_forms || []).map((value: DataFormInterface) => {
      return new DataForm(value, this.reactiveRecord.data_form_form_setting);
    });
  });

  static getCreateSteps(workflow: Partial<Workflow & WorkflowModel>, flowable_flag = '') {
    return workflow.form_setting_collection
      ? workflow.enable_level
        ? [
            ...getWorkflowLevelSteps(workflow.level_options || {}),
            ...new FormSetting(workflow.form_setting_collection).steps,
          ]
        : new FormSetting(workflow.form_setting_collection).steps
      : [];
  }

  static getEditSteps(instance: Instance & InstanceModel): any[] {
    return instance.data_form_form_setting
      ? instance.workflow_enable_level
        ? [
            ...getWorkflowLevelSteps(instance.workflow_level_options || {}),
            ...new FormSetting(instance.data_form_form_setting).steps,
          ]
        : new FormSetting(instance.data_form_form_setting).steps
      : [];
  }
}
