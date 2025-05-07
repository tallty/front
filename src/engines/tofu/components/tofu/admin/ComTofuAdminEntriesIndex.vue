<script lang="ts">
import { defineComponent, toRefs, PropType, computed, ref, watch, onMounted, Ref } from 'vue';
import { VStore } from '@/lib/vails';
import { VObject, VModel } from '@/lib/vails/model';
import { entryTemplate } from './template';
import { TofuEntry } from '@/engines/tofu/model';
import {
  TaTemplateFormItem,
  TaTemplateFormItemTreeData,
} from '@/components/global/ta-component/ta-template-form-core/types';
import { AntTreeNodeDropEvent } from 'ant-design-vue/lib/tree';

const ComTofuAdminEntriesIndex = defineComponent({
  name: 'ComTofuAdminEntriesIndex',
  components: {},
  props: {
    store: { type: Object as PropType<VStore<TofuEntry>>, required: true },
  },
  setup(props) {
    const searcherQuery = ref({});
    const treeData = ref<TaTemplateFormItemTreeData[]>([]);
    const treeDataRaw = ref<TofuEntry[]>([]);
    const treeDataIdMapping = ref<Record<number, TofuEntry>>({});

    const taIndexView = ref(null);
    const activeRecord: Ref<VModel<TofuEntry> | null> = ref(null);
    const editable = ref(false);
    const template = ref<TaTemplateFormItem>(entryTemplate);

    const config = computed(() => ({
      store: props.store,
      recordName: '导航',
      pagination: { perPage: 999999 },
      template: template.value,
      mode: 'custom',
    }));

    onMounted(() => {
      fetchTree();
    });

    const fetchIndex = () => {
      (taIndexView.value as any).fetchData(1, searcherQuery.value);
    };

    const fetchTree = async () => {
      const { data } = await props.store.sendCollectionAction({
        action: 'tree',
      });
      treeDataRaw.value = (data as VObject).records;
      treeDataIdMapping.value = {};
      treeData.value = processTree(
        treeDataRaw.value,
        () => true,
        (entry: TofuEntry) => (treeDataIdMapping.value[entry.id] = entry),
      );
      const treeDataOptions = [{ title: '空', value: null, children: treeData.value }];
      template.value.fields!.splice(5, 1, {
        name: '上级导航',
        type: 'tree',
        rules: [],
        model: { attr_type: 'string' },
        options: { span: 24, treeData: treeDataOptions },
        key: 'input_1620136712681_5',
        model_key: 'parent_id',
        fields: [],
        conditions: [],
        model_key_prefix: '',
      });
    };

    watch(
      () => searcherQuery,
      () => fetchIndex(),
      { deep: true },
    );

    const onIndex = (data: VObject) => {
      const remainIds = data['records']
        .map((record: TofuEntry) =>
          (record.ancestry?.split('/').map(i => Number(i)) || []).concat([record.id]),
        )
        .reduce((a: number[], b: number[]) => a.concat(b), []);

      treeData.value = processTree(treeDataRaw.value, (record: TofuEntry) =>
        remainIds.includes(record.id),
      );
    };

    const processTree = (
      ary: TofuEntry[],
      filterFn: (record: TofuEntry) => boolean = () => true,
      processFn: (record: TofuEntry) => void = () => {},
    ): TaTemplateFormItemTreeData[] => {
      return ary.filter(filterFn).map(entry => {
        processFn(entry);
        return {
          _record: entry,
          title: entry.desc ? `${entry.name}【${entry.desc}】` : entry.name,
          key: entry.id,
          value: entry.id,
          children: processTree(entry.children, filterFn, processFn),
        };
      });
    };

    const loading = ref(false);

    const onSelectTree = (_: string[], e: { node: any }) => {
      const info = e.node?._record || e.node?.props?.data?._record;
      if (info?.id) {
        loading.value = true;
        props.store.find(info.id).then(() => {
          loading.value = false;
          activeRecord.value = props.store.record.value as any;
        });
      }
    };

    const afterSave = () => {
      fetchTree();
    };

    const afterDelete = () => {
      fetchTree();
      activeRecord.value = null;
    };

    const onDrop = (info: AntTreeNodeDropEvent) => {
      let relativePosition = 0;
      let parentPos = [];
      const dragKey = info.dragNode.eventKey as number;
      const dropKey = info.node.eventKey as number;

      const dropPosAry: number[] = info.node.pos?.split('-')?.map((i: string) => Number(i)) || [];
      const dropPosition: number = dropPosAry[dropPosAry.length - 1];

      if (info.dropPosition == 0) {
        // 放在元素本身，放入子元素中
        console.log('放在元素本身，放入子元素中');
        relativePosition = 0;
        parentPos = dropPosAry;
      } else if (info.dropPosition < 0) {
        // 放在元素之前
        console.log('放在元素之前');
        relativePosition = dropPosition - 1 < 0 ? 0 : dropPosition - 1;
        parentPos = dropPosAry.splice(0, dropPosAry.length - 1);
      } else {
        // 放在元素之后
        console.log('放在元素之后');
        parentPos = dropPosAry.splice(0, dropPosAry.length - 1);

        // 目标的 parent_id === 拖动的 parent_id
        const theSameParent =
          getNodeByPos(parentPos).id === treeDataIdMapping.value[dragKey].parent_id;
        // 在同一个父级的情况下，目标的 position > 拖动前的 position，position 不加1，替换原有位置

        const targetBehind =
          treeDataIdMapping.value[dropKey].parent_id > treeDataIdMapping.value[dragKey].parent_id;

        if (theSameParent && targetBehind) {
          relativePosition = dropPosition;
        } else {
          relativePosition = dropPosition + 1;
        }
      }

      const parentId = getNodeByPos(parentPos).id;
      const position = relativePosition;
      const id = dragKey as number;

      new VModel<TofuEntry>({ id }, props.store)
        .update({ position: position + 1, parent_id: parentId })
        .then(() => fetchTree());
    };

    const getNodeByPos = (posAry: number[]) => {
      if (posAry === [0]) {
        return {};
      }
      return posAry.reduce(
        (tree: any, position, index) => {
          if (index === posAry.length - 1) {
            return tree[position];
          } else {
            return tree[position].children;
          }
        },
        [
          {
            id: null,
            children: treeDataRaw.value,
          },
        ],
      );
    };

    return {
      ...toRefs(props),
      searcherQuery,
      config,
      onIndex,
      treeData,
      onSelectTree,
      activeRecord,
      template,
      editable,
      afterSave,
      afterDelete,
      taIndexView,
      onDrop,
      loading,
    };
  },
});

export default ComTofuAdminEntriesIndex;
</script>

<template lang="pug">
.com-tofu-admin-entries-index.flex
  TaIndexView.left.h-full.flex-shrink-0.overflow-y-auto(
    ref='taIndexView',
    :config='config',
    @onIndex='onIndex',
    @afterSave='afterSave'
  )
    template(#header='{ actions }')
      .left-header
        .search-group
          TaSearcher(v-model:value='searcherQuery', :variables='["name"]', tips='检索')
        .actions
          TaRoundButton.add-button(:style='{ width: "100%" }', @click='actions.onCreate') 新增导航
    template(#content)
      a-tree.tree(
        :tree-data='treeData',
        :showIcon='true',
        draggable,
        @select='onSelectTree',
        @drop='onDrop'
      )
        template(#icon='{ _record }')
          TaIcon(:type='_record.icon')

  .right.h-full.overflow-y-auto
    TaTitleHeader(title='导航配置')
    a-spin(:spinning='loading')
      .content
        TaTemplateFormWithActions(
          :key='activeRecord.id',
          v-if='activeRecord',
          v-model:editable='editable',
          :record='activeRecord',
          :template='template',
          @afterSave='afterSave',
          @afterDelete='afterDelete'
        )
</template>

<style lang="stylus" scoped>
.com-tofu-admin-entries-index
  height 100%
  width 100%
  .right
    height 100%
    .content
      // height 100%
  .left
    width 200px
    margin-right 24px
    .clickable
      margin-bottom 1px
    .left-header
      margin-bottom 10px
      width 200px
      .actions
        display flex
        margin-top 18px
        .add-button
          background $primary-color
          color white
      .search-group
        max-width 200px
        overflow hidden
        display flex
        align-items center
        padding 5px 10px
        height 34px
        width 100%
        border-radius 4px
        border 1px solid #C3C6CE
        .icon
          padding-right 5px
</style>
