import { MyApi } from '@/apis/MyApi';
import { VApiConfig } from '@/lib/vails/api';
import { VModel, VObject } from '@/lib/vails/model/index';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BpmTokenPlaceToken } from '../../BpmTokenPlace';
import { Token, TokenTypes } from '../../types';

dayjs.extend(duration);
dayjs.extend(relativeTime);

function getI18nFunction(testKey: string) {
  try {
    const { useI18n } = require('vue-i18n');
    const { t } = useI18n();
    //测试有无对应的翻译，没有则返回false
    const testResult = t(testKey) === testKey;

    return testResult ? false : t;
  } catch (error) {
    // vue-i18n 不可用，返回false
    console.log(error);
    return false;
  }
}
export class BpmUserTokens extends MyApi<Token> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/user',
      name: 'token',
      actions: [{ name: 'fire', on: 'member', method: 'post' }],
      ...config,
    });
  }
}

export class TokenModel extends VModel<Token> {
  static tokenActionZhMap(): VObject {
    return {
      submit: '提交',
      complete: '完成',
      print: '打印',
      edit: '编辑',
      assign: '分配',
      forward: '转交',
      recall: '撤回',
      reject: '退回',
      fail: '失败',
      terminate: '终止',
      // 以下老版本
      // accept: '通过',
    };
  }
  static stateMap(
    type = '',
    action_info: { action_name?: string } = {}
  ): VObject {
    const t = getI18nFunction('bpm.state.completed');
    let completedLabel =
      action_info?.action_name ||
      (type === TokenTypes.Handle ? '已操作' : '已完成');
    if (type === TokenTypes.Approval) completedLabel = '已完成';

    return {
      created: {
        value: 'created',
        label: '待提交',
        type: 'info',
        color: '#CCCCCC',
        icon: 'PlayCircleOutlined',
        taroIcon: 'clock',
      },
      preparing: {
        value: 'preparing',
        label: type === TokenTypes.Handle ? '待操作' : '待处理',
        type: 'info',
        color: '#CCCCCC',
        icon: 'PlayCircleOutlined',
        taroIcon: 'clock',
      },
      processing: {
        value: 'processing',
        label: type === TokenTypes.Handle ? '待操作' : '进行中',
        type: 'primary',
        color: '#1890ff',
        icon: 'PlayCircleOutlined',
        taroIcon: 'clock',
      },
      inactivated: {
        value: 'inactivated',
        label: type === TokenTypes.Handle ? '待操作' : '进行中',
        type: 'primary',
        color: '#1890ff',
        icon: 'PlayCircleOutlined',
        taroIcon: 'clock',
      },
      completed: {
        value: 'completed',
        label: t ? t('bpm.state.completed') : completedLabel,
        type: 'success',
        color: '#15bc83',
        icon: 'CheckCircleOutlined',
        taroIcon: 'check',
      },
      checked: {
        value: 'checked',
        label: t ? t('bpm.state.checked') : '审核通过',
        type: 'success',
        color: '#15bc83',
        icon: 'CheckCircleOutlined',
        taroIcon: 'check',
      },
      received: {
        value: 'received',
        label: t ? t('bpm.state.received') : '已收件',
        type: 'success',
        color: '#15bc83',
        icon: 'CheckCircleOutlined',
        taroIcon: 'check',
      },
      rejected: {
        value: 'rejected',
        label: t ? t('bpm.state.rejected') : '已驳回',
        type: 'warning',
        color: '#f29851',
        icon: 'CloseCircleOutlined',
        taroIcon: 'close',
      },
      failed: {
        value: 'failed',
        label: t ? t('bpm.state.failed') : '已退回',
        type: 'warning',
        color: '#f5222d',
        icon: 'CloseCircleOutlined',
        taroIcon: 'close',
      },
      been_fail: {
        value: 'been_fail',
        label: t ? t('bpm.state.been_fail') : '被退回',
        type: 'warning',
        color: '#f29851',
        icon: 'PlayCircleOutlined',
        taroIcon: 'close',
      },
      been_reject: {
        value: 'been_reject',
        label: t ? t('bpm.state.been_reject') : '被驳回',
        type: 'warning',
        color: '#f29851',
        icon: 'PlayCircleOutlined',
        taroIcon: 'close',
      },
      canceled: {
        value: 'canceled',
        label: t ? t('bpm.state.canceled') : '已取消',
        type: 'warning',
        color: '#f5222d',
        icon: 'MinusCircleOutlined',
        taroIcon: 'close',
      },
      terminated: {
        value: 'terminated',
        label: t ? t('bpm.state.terminated') : '已终止',
        type: 'danger',
        color: '#f5222d',
        icon: 'StopOutlined',
        taroIcon: 'close',
      },
    };
  }

  title = this.computedAttr('title', () => {
    let summary = '';

    if (TokenTypes.Assign === this.reactiveRecord.type) {
      summary =
        this.reactiveRecord.state === 'completed' ? '（已指派）' : '（待指派）';
    }

    if (TokenTypes.ForwardFrom === this.reactiveRecord.type) {
      summary =
        this.reactiveRecord.state === 'completed' ? '（已转办）' : '（待转办）';
    }

    return `${
      this.reactiveRecord.operator_id
        ? this.reactiveRecord.operator_name || ''
        : '系统'
    }${summary}`;
  });

  hideStateTag = this.computedAttr('hideStateTag', () => {
    return (
      TokenTypes.Assign === this.reactiveRecord.type ||
      TokenTypes.ForwardFrom === this.reactiveRecord.type
    );
  });

  stateInfo = this.computedAttr(
    'stateInfo',
    () =>
      TokenModel.stateMap(
        this.reactiveRecord.type,
        this.reactiveRecord.action_info
      )[this.reactiveRecord.state]
  );
  static oldTokenActionZhMap(): VObject {
    return {
      submit: '提交',
      complete: '完成',
      print: '打印',
      edit: '编辑',
      assign: '分配',
      forward: '转交',
      recall: '撤回',
      reject: '打回',
      fail: '退回',
      terminate: '终止',
      // 以下老版本
      accept: '通过',
    };
  }
  static oldStateMap(): VObject {
    return {
      created: {
        value: 'created',
        label: '待提交',
        type: 'info',
        color: '#CCCCCC',
        icon: 'PlayCircleOutlined',
        taroIcon: 'clock',
      },
      preparing: {
        value: 'preparing',
        label: '待处理',
        type: 'info',
        color: '#CCCCCC',
        icon: 'PlayCircleOutlined',
        taroIcon: 'clock',
      },
      processing: {
        value: 'processing',
        label: '进行中',
        type: 'primary',
        color: '#1890ff',
        icon: 'PlayCircleOutlined',
        taroIcon: 'clock',
      },
      completed: {
        value: 'completed',
        label: '已完成',
        type: 'success',
        color: '#15bc83',
        icon: 'CheckCircleOutlined',
        taroIcon: 'check',
      },
      checked: {
        value: 'checked',
        label: '审核通过',
        type: 'success',
        color: '#15bc83',
        icon: 'CheckCircleOutlined',
        taroIcon: 'check',
      },
      received: {
        value: 'received',
        label: '已收件',
        type: 'success',
        color: '#15bc83',
        icon: 'CheckCircleOutlined',
        taroIcon: 'check',
      },
      rejected: {
        value: 'rejected',
        label: '已驳回',
        type: 'warning',
        color: '#f29851',
        icon: 'PlayCircleOutlined',
        taroIcon: 'close',
      },
      failed: {
        value: 'failed',
        label: '已退回',
        type: 'warning',
        color: '#f5222d',
        icon: 'CloseCircleOutlined',
        taroIcon: 'close',
      },
      canceled: {
        value: 'canceled',
        label: '已取消',
        type: 'warning',
        color: '#f5222d',
        icon: 'MinusCircleOutlined',
        taroIcon: 'close',
      },
      terminated: {
        value: 'terminated',
        label: '已终止',
        type: 'danger',
        color: '#f5222d',
        icon: 'StopCircleOutlined',
        taroIcon: 'close',
      },
    };
  }

  oldStateInfo = this.computedAttr(
    'oldStateInfo',
    () => TokenModel.stateMap()[this.reactiveRecord.state]
  );

  createdStr = this.computedAttr('createdStr', () =>
    dayjs(this.reactiveRecord.created_at).format('YYYY/MM/D HH:mm')
  );

  updatedStr = this.computedAttr('updatedStr', () =>
    dayjs(this.reactiveRecord.updated_at).format('YYYY/MM/D HH:mm')
  );

  spendTimeStr = this.computedAttr('spendTimeStr', () => {
    if (this.reactiveRecord.spent_time_in_second) {
      return dayjs
        .duration(this.reactiveRecord.spent_time_in_second, 'seconds')
        .humanize();
    }
    return '';
  });

  static isTokenPayloadEmpty = (token: Token) => {
    return !new BpmTokenPlaceToken(token).dataFormExists;
  };
}
