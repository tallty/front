<script lang="ts">
import { ref, defineComponent } from 'vue';
export default defineComponent({
  name: '',
  components: {},
  setup() {
    let msg = ref('');
    return {
      msg,
    };
  },
});
</script>

<template lang="pug">
.list(class='mt-[20px] text-green-400') {{ 123 }}
</template>

<style lang="stylus"></style>
