import {
  PlaceMenuTemplate,
  PlaceTypes,
  TransitionTypes,
  Workflow,
  WorkflowCore,
  WorkflowState,
} from '@/engines/bpm/bpm-core/types';
import { VObject } from '@/lib/vails/model/index';
import { defaultTokenActionsOptions } from '../nodeEditor/template';

const source: VObject = {
  get core() {
    return {
      tree: [{ source: { id: null, seq: 'start' }, target: { id: null, seq: 'end' } }],
      places: [
        {
          id: null,
          name: '开始',
          seq: 'start',
          type: PlaceTypes.StartPlace,
          transition_type: TransitionTypes.And,
          options: {},
          // token_actions: { actions: defaultTokenActionsOptions },
          fields: { fields: [] },
        },
        {
          id: null,
          name: '结束',
          seq: 'end',
          type: PlaceTypes.EndPlace,
          transition_type: TransitionTypes.And,
          options: {},
          // token_actions: { actions: [] },
          fields: { fields: [] },
        },
      ],
    };
  },
  get workflow() {
    return {
      id: null,
      type: 'Bpm::Workflow',
      state: WorkflowState.Todo,
      name: '',
      desc: '',
      core: this.core,
      form: {
        fields: [],
      },
      meta: {
        workflow_attributes: [],
        token_callbacks: [],
        workflow_callbacks: [],
        workflow_roles: [],
      },
    };
  },
  get places() {
    return [
      {
        name: '审批',
        desc: '配置审批节点',
        icon: '',
        type: PlaceTypes.Approval,
        transition_type: TransitionTypes.And,
        token_actions: { actions: [] },
        payload: {
          options: {},
        },
      },
      {
        name: '操作',
        desc: '配置操作节点',
        icon: '',
        type: PlaceTypes.Handle,
        transition_type: TransitionTypes.And,
        token_actions: { actions: [] },
        payload: {
          options: {},
        },
      },
      {
        name: '抄送',
        desc: '配置抄送节点',
        icon: '',
        type: PlaceTypes.Notify,
        transition_type: TransitionTypes.And,
        token_actions: { actions: [] },
        payload: {
          options: {},
        },
      },
      {
        name: '回调',
        desc: '配置回调节点',
        icon: '',
        type: PlaceTypes.Trigger,
        transition_type: TransitionTypes.And,
        token_actions: { actions: [] },
        payload: {
          options: {},
        },
      },
      { name: '条件', desc: '配置条件分支', icon: '', type: PlaceTypes.Route, isRoute: true },
      // {
      //   name: '功能回调',
      //   desc: '配置内置的回调功能',
      //   icon: '',
      //   type: PlaceTypes.Place,
      //   transition_type: TransitionTypes.And,
      //   payload: {
      //     options: { name: '', callback_method: '' },
      //   },
      // },
      // {
      //   name: '接口回调',
      //   desc: '配置自定义接口回调',
      //   icon: '',
      //   type: PlaceTypes.Place,
      //   transition_type: TransitionTypes.And,
      //   payload: {
      //     options: {
      //       method: 'post',
      //       url: '',
      //       headers: {},
      //       key_attrs: [] as ApiKeyAttr[],
      //     },
      //   },
      // },
      // {
      //   name: '服务方法回调',
      //   desc: '配置服务方法回调',
      //   icon: '',
      //   type: PlaceTypes.Place,
      //   transition_type: TransitionTypes.And,
      //   payload: {
      //     options: {
      //       function: '',
      //       class_name: '',
      //       key_attrs: [] as ApiKeyAttr[],
      //     },
      //   },
      // },
      // {
      //   name: '计算',
      //   desc: '配置属性计算',
      //   icon: '',
      //   type: PlaceTypes.Place,
      //   transition_type: TransitionTypes.And,
      //   payload: {
      //     options: {
      //       function: '',
      //       formula: '',
      //     },
      //   },
      // },
    ];
  },
};

export const defaultCore: WorkflowCore = source.core;

export const defaultWorkflow: Workflow = source.workflow;

export const defaultMenuPlaces: PlaceMenuTemplate[] = source.places;
