<template>
  <a-result
    status="403"
    title="403"
    style="background: none"
    sub-title="Sorry, you don't have access to this page."
  >
    <template #extra>
      <router-link to="/">
        <a-button type="primary">Back Home</a-button>
      </router-link>
    </template>
  </a-result>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Result } from 'ant-design-vue';

export default defineComponent({
  name: 'Exception403',
  setup() {
    return {};
  },
  components: {
    // custom register component
    [Result.name]: Result,
  },
});
</script>
