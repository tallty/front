<template>
  <a-result
    status="404"
    title="404"
    style="background: none"
    sub-title="Sorry, the page you visited does not exist."
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
  name: 'Exception404',
  setup() {
    return {};
  },
  components: {
    // custom register component
    [Result.name]: Result,
  },
});
</script>
