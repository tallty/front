<script lang="ts">
import { VApi, VObject, VStore } from '@/lib/vails';
import { computed, defineComponent, toRefs } from 'vue';
import { Token } from '../bpm-core/types';

/**
 * item: {
 *   id: number;
 *   name: string;
 *   token_ids: number[];
 *   token_state: string;
 *   position: number;
 *   place: Place;
 *   token_state: string;
 *   tokens: Token[]
 * }
 */

const ComBpmTokenSourceTable = defineComponent({
  name: 'ComBpmTokenSourceTable',
  components: {},
  props: {
    item: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const store = new VStore(new VApi<any>());

    store.api.index = () =>
      new Promise<any>(resolve =>
        resolve({
          data: {
            records: props.item.tokens
              .map((token: Token) => token.token_source)
              .filter((i: VObject | undefined) => i),
          },
        }),
      );

    const config = computed(() => ({
      store,
      mode: 'table',
      pagination: { hide: true },
      template: props.item?.token_source_template?.form || {},
      actions: [
        { key: 'create', enabled: false },
        { key: 'update', enabled: false },
        { key: 'delete', enabled: false },
        { key: 'import', enabled: false },
        { key: 'export', enabled: false },
      ],
    }));

    return {
      ...toRefs(props),
      config,
    };
  },
});
export default ComBpmTokenSourceTable;
</script>

<template lang="pug">
.com-bpm-token-source-table
  TaIndexView(:config='config')
    template(#header)
      .empty
</template>

<style lang="stylus" scoped></style>
