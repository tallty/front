<script lang="ts">
import { VObject } from '@/lib/vails/model';
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue';

interface EveryPeopleTime {
  name: string;
  userId: number;
  times: number;
  totalTime: number;
}

interface WorkflowData {
  title: string;
  number: string | number;
  borderColor: string;
  width: string;
}

const ComBpmInstanceTimeSpend = defineComponent({
  name: 'ComBpmInstanceTimeSpend',
  components: {},
  props: {
    instance: { type: Object, default: () => ({ tokens: [], current_token: {} }), required: true },
    formatedTokens: { type: Array },
  },
  emits: [],
  setup(props) {
    const dataCard = reactive({
      peopleNumber: 0,
      approvalNumber: 0,
      totalTime: '',
      averageTime: '',
      refundNumber: 0,
      everyPeopleTime: [],
    });
    const visible = ref(false);
    const workflowDataArray = computed(() => {
      let workflowDataArray: WorkflowData[] = [];
      workflowDataArray = [
        {
          width: '43.75%',
          title: '平均耗时',
          number: dataCard.averageTime || 0,
          borderColor: '#A1A4D9',
        },
        {
          width: '43.75%',
          title: '总耗时',
          number: dataCard.totalTime || 0,
          borderColor: '#FA791D',
        },
        {
          width: '25%',
          title: '审批节点',
          number: dataCard.approvalNumber || 0,
          borderColor: '#3EA8F5',
        },
        {
          width: '25%',
          title: '参与人数',
          number: dataCard.peopleNumber || 0,
          borderColor: '#FFECCD',
        },
        {
          width: '25%',
          title: '退改数',
          number: dataCard.refundNumber || 0,
          borderColor: '#9ED979',
        },
      ];
      return workflowDataArray;
    });

    const calcEveryPeopleTime = (array: Record<string, any>[], key: string) => {
      const everyPeopleTime: EveryPeopleTime[] = [];
      const newArr = array.filter(item => ['Tokens::Approval'].includes(item[key]));

      newArr.map(item => {
        everyPeopleTime.push({
          name: item.operator_name,
          times: 1,
          userId: item.operator_id,
          totalTime: Number(formatDuring(item.spent_time_in_second)),
        });
      });

      const newArray: EveryPeopleTime[] = everyPeopleTime.reduce(
        (total: EveryPeopleTime[], cur) => {
          const hasValue = total.findIndex((current: any) => {
            return current.userId === cur.userId;
          });
          hasValue === -1 && total.push(cur);
          hasValue !== -1 &&
            (total[hasValue].totalTime = total[hasValue].totalTime + cur.totalTime);
          hasValue !== -1 && (total[hasValue].times = total[hasValue].times + cur.times);
          return total;
        },
        [],
      );
      return newArray;
    };
    const delWiederholbar = (arr: Record<string, any>[], key: string) => {
      const res: Record<string, any>[] = [];
      const newArr = arr.filter(item =>
        ['Tokens::Approval', 'Tokens::ApprovalSelect'].includes(item.type),
      );
      newArr.forEach((item: VObject) => {
        const list: Record<string, any>[] = [];
        res.forEach(resitem => {
          list.push(resitem[key]);
        });
        if (list.indexOf(item[key]) === -1) {
          res.push(item);
        }
      });
      return res;
    };
    const NumberOfStatistics = (
      array: Record<string, any>[],
      key: string,
      valueArray: string[],
    ) => {
      let newArr: Record<string, any>[] = [];
      valueArray.map((item: string) => {
        newArr.push(array.filter(arrayItem => arrayItem[key] === item));
      });
      return newArr.flat();
    };
    const formatDuring = (millisecond: number) => {
      const days = millisecond / (60 * 60 * 24);
      const hours = (millisecond % (60 * 60 * 24)) / (60 * 60);
      const minutes = (millisecond % (60 * 60)) / 60;
      const seconds = millisecond % 60;
      let totalTime = '';
      if (days >= 1) {
        totalTime += Math.floor(days) + '天';
      }
      if (hours >= 1) {
        totalTime += Math.floor(hours) + '小时';
      }
      if (minutes >= 1 && days < 1) {
        totalTime += Math.floor(minutes) + '分';
      }
      if (seconds >= 1 && days < 1 && hours < 1) {
        totalTime += Math.floor(seconds) + '秒';
      }
      if (totalTime === '') {
        totalTime = '0';
      }
      return totalTime;
    };
    const showModal = () => {
      visible.value = true;
    };
    const handleCancel = () => {
      visible.value = false;
    };
    const formatedTokensWatch = (newValues: any) => {
      const peopleNumberArr: Record<string, any>[] = delWiederholbar(newValues, 'operator_name');
      const approvalArr = NumberOfStatistics(newValues, 'type', [
        'Tokens::Approval',
        'Tokens::Handle',
        'Tokens::ForwardTo',
        'Tokens::ForwardFrom',
      ]);
      const approvalNumber = approvalArr.length;
      const refundNumber = NumberOfStatistics(newValues, 'state', ['failed', 'rejected']).length;
      // const everyPeopleTime = calcEveryPeopleTime(newValues, 'type');
      let averageTime = 0;
      let totalAverageTime = approvalArr.reduce((total_time: number, cur: any) => {
        return total_time + Number(cur.spent_time_in_second);
      }, 0);

      if (approvalNumber > 1) {
        averageTime = totalAverageTime / approvalNumber;
      } else {
        averageTime = totalAverageTime;
      }

      dataCard.totalTime = formatDuring(props.instance.spent_time_in_second || totalAverageTime);
      dataCard.averageTime = formatDuring(averageTime);
      dataCard.peopleNumber = peopleNumberArr.length;
      dataCard.approvalNumber = approvalNumber;
      dataCard.refundNumber = refundNumber;
      // dataCard.everyPeopleTime = everyPeopleTime;
      // console.log('dataCard', dataCard);
    };

    watch(
      () => props.formatedTokens,
      () => {
        formatedTokensWatch(props.formatedTokens);
      },
      { immediate: true },
    );
    return {
      ...toRefs(props),
      formatDuring,
      workflowDataArray,
      showModal,
      handleCancel,
      visible,
      dataCard,
    };
  },
});

export default ComBpmInstanceTimeSpend;
</script>

<template lang="pug">
.com-bpm-instance-time-spend
  .item-box-workflow
    .item(
      v-for='item in workflowDataArray',
      :style='{ borderColor: item.borderColor, width: item.width }'
    )
      .item-title {{ item.title }}
      .item-number {{ item.number }}
  //- a-modal(:visible='visible', :title='"统计详情"', :footer='null', @cancel='handleCancel')
    .card-modal
      a-table(rowKey='name', :data-source='dataCard.everyPeopleTime', :pagination='false')
        a-table-column(:autoHeight='true' title='姓名', data-index='name')
          template(slot-scope='name')
            span {{ name }}
        a-table-column(:autoHeight='true' title='次数', data-index='times')
          template(slot-scope='times')
            span {{ times }}
        a-table-column(:autoHeight='true' title='平均时长', data-index='totalTime')
          template(slot-scope='totalTime,record')
            span {{ formatDuring(totalTime / record.times) }}
</template>

<style lang="stylus" scoped>
.com-bpm-instance-time-spend
  width 100%
  overflow hidden
  box-shadow 0px 0px 7px 0px rgba(212, 212, 212, 0.5), 0px 0px 7px 0px rgba(212, 212, 212, 0.3)
  border-radius 4px
  // cursor pointer
  padding 10px 20px
  margin 0 auto
  margin-bottom 16px
  background #FFFFFF
  .item-box-workflow
    display flex
    flex-wrap wrap
    justify-content space-between
    align-items center
    align-content center
    align-content space-between
    width calc(100% - 40px)
    height 100%
    .item
      margin 10px 0
      padding-right 5px
      min-width 60px
      border-bottom 2px solid red
      .item-title
        margin-bottom 2px
        color rgba(68, 68, 68, 0.45)
        font-weight 400
        font-size 12px
        font-family PingFangSC-Regular, PingFang SC
      .item-number
        color #444444
        font-weight 500
        font-size 18px
        font-family PingFangSC-Medium, PingFang SC
  .more-btn
    position absolute
    right -50px
    // background: rgba(255, 0, 0, 0.63);
    bottom -50px
    width 100px
    height 100px
    border-radius 50%
    cursor pointer
  .more-icon
    position absolute
    right 0
    bottom 0
    display flex
    justify-content center
    align-items center
    width 40px
    height 40px
    cursor pointer
    .icon
      color #fff
      font-size 24px
</style>
