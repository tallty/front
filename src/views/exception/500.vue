<template>
  <a-result
    status="500"
    title="500"
    style="background: none"
    sub-title="Sorry, the server is reporting an error."
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
  name: 'Exception500',
  setup() {
    return {};
  },
  components: {
    // custom register component
    [Result.name]: Result,
  },
});
</script>
