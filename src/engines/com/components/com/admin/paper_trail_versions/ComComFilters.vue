<script lang="ts">
import { defineComponent, toRefs, ref, computed, Ref, PropType, watch } from 'vue';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';

interface Filter {
  key: string;
  predicate: string;
  value: any;
  subValue?: any;
  field: ColumnConfig;
}

interface ColumnConfig {
  key: string;
  label: string;
  type: string;
  options?: [];
  mode?: string;
}

const ComComFilters = defineComponent({
  name: 'ComComFilters',
  props: {
    fields: { type: Array as PropType<ColumnConfig[]>, required: true, default: () => [] },
  },
  emits: ['filtersChanged'],
  setup(props, { emit }) {
    const getPredicateOptions = (type: string) => {
      if (type === 'select') {
        return [
          { label: '包含', value: 'in' },
          { label: '不包含', value: 'not_in' },
          { label: '为空', value: 'null' },
          { label: '不为空', value: 'not_null' },
        ];
      } else if (type === 'text') {
        return [
          { label: '包含', value: 'cont' },
          { label: '不包含', value: 'not_cont' },
          { label: '等于', value: 'eq' },
          { label: '不等于', value: 'not_eq' },
          { label: '为空', value: 'null' },
          { label: '不为空', value: 'not_null' },
        ];
      } else if (type === 'number') {
        return [
          { label: '等于', value: 'eq' },
          { label: '大于', value: 'gt' },
          { label: '大于等于', value: 'gte' },
          { label: '小于', value: 'lt' },
          { label: '小于等于', value: 'lte' },
          { label: '不等于', value: 'not_eq' },
        ];
      } else if (type === 'datetime') {
        return [
          { label: '等于', value: 'eq' },
          { label: '晚于', value: 'gt' },
          { label: '早于', value: 'lt' },
          { label: '为空', value: 'null' },
          { label: '不为空', value: 'not_null' },
        ];
      }

      return [
        { label: '为空', value: 'null' },
        { label: '不为空', value: 'not_null' },
      ];
    };

    const filters: Ref<Filter[]> = ref([]);

    const resetFilter = (filter: any) => {
      const field: any = getChoosedField(filter.key);
      const predicates = getPredicateOptions(field.type);
      filter.predicate = predicates[0]?.value;
      if (field.type === 'select' && field.mode === 'multiple') {
        filter.value = [];
      } else if (field.type === 'datetime') {
        filter.value = dateTimeOptions[0].value;
      } else {
        filter.value = null;
      }
      filter.subValue = null;
      filter.field = field;
      return filter;
    };

    const onAddFilter = () => {
      if (filtersCount.value < 5) {
        const field = props.fields[0];
        filters.value.push(resetFilter({ key: field.key }));
      } else {
        message.warning('最多支持5个筛选条件');
      }
    };

    const onRemoveFilter = (index: number) => {
      filters.value.splice(index, 1);
    };

    const getChoosedField = (key: string) => {
      return props.fields.find((field: any) => field.key === key) || {};
    };

    const configVisible = ref(false);

    const aggr = ref('and');
    const aggrOptions = [
      { label: '所有', value: 'and' },
      { label: '任意', value: 'or' },
    ];

    const filtersCount = computed(() => {
      return Object.keys(filters.value).length;
    });

    const searchValue = computed(() => {
      const res: any = { m: aggr.value };

      filters.value.forEach((filter: Filter) => {
        if (filter.field.type === 'datetime') {
          let values =
            dateTimeOptions.find((option: any) => option.value === filter.value)?.values || [];
          if (filter.value === 'pick' && filter.subValue) {
            values = [
              dayjs(filter.subValue).startOf('day').format('YYYY-MM-DD HH:mm:ss Z'),
              dayjs(filter.subValue).endOf('day').format('YYYY-MM-DD HH:mm:ss Z'),
            ];
          }
          if (filter.predicate === 'eq') {
            res[`${filter.key}_gteq`] = values[0];
            res[`${filter.key}_lteq`] = values[1];
          } else {
            res[`${filter.key}_${filter.predicate}`] = ['null', 'not_null'].includes(
              filter.predicate,
            )
              ? 1
              : values[0];
          }
        } else {
          res[`${filter.key}_${filter.predicate}`] = ['null', 'not_null'].includes(filter.predicate)
            ? 1
            : filter.value;
        }
      });

      return res;
    });

    const dateTimeOptions = [
      { label: '具体时间', value: 'pick' },
      {
        label: '今天',
        value: 'today',
        values: [
          dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss Z'),
          dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss Z'),
        ],
      },
      {
        label: '昨天',
        value: 'yesterday',
        values: [
          dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss Z'),
          dayjs().subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss Z'),
        ],
      },
      {
        label: '本周',
        value: 'week',
        values: [
          dayjs().startOf('week').format('YYYY-MM-DD HH:mm:ss Z'),
          dayjs().endOf('week').format('YYYY-MM-DD HH:mm:ss Z'),
        ],
      },
      {
        label: '本月',
        value: 'month',
        values: [
          dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss Z'),
          dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss Z'),
        ],
      },
      {
        label: '上月',
        value: '1_month',
        values: [
          dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss Z'),
          dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss Z'),
        ],
      },
      {
        label: '过去7天',
        value: '7_days',
        values: [
          dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss Z'),
          dayjs().format('YYYY-MM-DD HH:mm:ss Z'),
        ],
      },
      {
        label: '过去30天',
        value: '30_days',
        values: [
          dayjs().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss Z'),
          dayjs().format('YYYY-MM-DD HH:mm:ss Z'),
        ],
      },
    ];

    const onPredicateChange = (filter: Filter) => {
      if (['null', 'not_null'].includes(filter.predicate)) {
        if (filter.field.type === 'select' && filter.field.mode === 'multiple') {
          filter.value = [];
        } else if (filter.field.type === 'datetime') {
          filter.value = dateTimeOptions[0].value;
        } else {
          filter.value = null;
        }
        filter.subValue = null;
      }
    };

    const clearFilters = () => {
      filters.value = [];
    };

    watch(
      () => searchValue.value,
      () => emit('filtersChanged', searchValue.value),
    );

    return {
      ...toRefs(props),
      filters,
      onAddFilter,
      onRemoveFilter,
      resetFilter,
      clearFilters,

      getPredicateOptions,
      onPredicateChange,
      getChoosedField,
      configVisible,

      dateTimeOptions,

      aggr,
      aggrOptions,
      filtersCount,
    };
  },
});

export default ComComFilters;
</script>

<template lang="pug">
a-dropdown(v-model:visible='configVisible', :trigger="['click']")
  .flex.items-center.bg-white.rounded-lg.border.border-gray-200.text-gray-900.py-2.px-4.cursor-pointer(:class='{ "bg-blue-50": filtersCount > 0 }')
    TaIcon.w-4.h-4(type='outline/filter')
    .ml-2 筛选
  template(#overlay)
    .w-150.bg-white.px-4.py-3.shadow-md.rounded-lg
      .flex.justify-between.items-center.mb-4
        .text-sm.text-gray-500 设置筛选条件
        .flex.items-center.gap-x-2(v-if='filtersCount > 1')
          span 符合以下
          a-select(v-model:value='aggr', size='small')
            a-select-option(v-for='option in aggrOptions' :value='option.value') {{ option.label }}
          span 条件
      .com-com-filters
        .flex.items-center.mb-4(v-for='(filter, index) in filters')
          .field-sec.mr-4
            a-select(v-model:value='filter.key', style='width:100%', @change='resetFilter(filter)')
              a-select-option(v-for='field in fields', :value='field.key') {{ field.label }}
          .cond-sec.mr-4
            a-select(v-model:value='filter.predicate', style='width:100%' @change='onPredicateChange(filter)')
              a-select-option(v-for='predicate in getPredicateOptions(filter.field.type)' :value='predicate.value') {{ predicate.label }}
          .value-sec.mr-2
            a-select(
              v-model:value='filter.value',
              :mode='filter.field.mode',
              :disabled='["null", "not_null"].includes(filter.predicate)',
              style="width:100%",
             v-if='filter.field.type == "select"'
            )
              a-select-option(v-for='option in filter.field.options', :value='option.value') {{ option.label }}
            a-input(
              v-model:value='filter.value',
              :disabled='["null", "not_null"].includes(filter.predicate)',
              v-if='filter.field.type == "text"'
            )
            a-input-number(
              v-model:value='filter.value',
              :disabled='["null", "not_null"].includes(filter.predicate)',
              v-if='filter.field.type == "number"'
            )
            .flex.items-center.gap-x-4(v-if='filter.field.type == "datetime"')
              a-select(v-model:value='filter.value', style="width:120px", :disabled='["null", "not_null"].includes(filter.predicate)')
                a-select-option(v-for='option in dateTimeOptions', :value='option.value') {{ option.label }} 
              a-date-picker(v-model:value='filter.subValue', :disabled='filter.value != "pick" || ["null", "not_null"].includes(filter.predicate)')
          .delete-sec.cursor-pointer(@click='onRemoveFilter(index)')
            TaIcon.w-5.h-5(type='CloseOutlined')
      .flex.items-center.justify-between
        .flex.items-center.p-2.text-gray-600.cursor-pointer.gap-x-1(@click='onAddFilter()')
          TaIcon.w-4.h-4(type='outline/plus')
          .tex-sm 添加条件
</template>

<style lang="stylus">
.com-com-filters
  max-height: 210px;
  overflow-y: scroll;
  .field-sec
    width: 110px
  .cond-sec
    width: 100px
  .value-sec
    width: calc(100% - 210px)
</style>
