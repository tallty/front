<template>
  <div class="row">
    <div class="col-8">
      <h3>Nested draggable</h3>
      <nested-draggable :tasks="list" />
    </div>
    <rawDisplayer class="col-3" :value="list" title="List" />
  </div>
</template>

<script>
import nestedDraggable from './drag.vue';
export default {
  name: 'nested-example',
  display: 'Nested',
  order: 15,
  components: {
    nestedDraggable,
  },
  watch: {
    list: {
      handler(newName) {
        console.log(newName, 123123);
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      list: [
        {
          name: 'task 1',
          tasks: [
            {
              name: 'task 2',
              tasks: [],
            },
          ],
        },
        {
          name: 'task 3',
          tasks: [
            {
              name: 'task 4',
              tasks: [],
            },
          ],
        },
        {
          name: 'task 5',
          tasks: [],
        },
      ],
    };
  },
};
</script>
<style scoped></style>
