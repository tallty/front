<script lang="ts">
import { defineComponent } from 'vue';
import ComComAdminPaperTrailVersionsIndex from '@/engines/com/components/com/admin/paper_trail_versions/ComComAdminPaperTrailVersionsIndex.vue';

export default defineComponent({
  name: 'ComAdminPaperTrailVersionsIndex',
  components: { ComComAdminPaperTrailVersionsIndex },
  setup() {},
});
</script>

<template lang="pug">
.com-admin-paper-trail-versions-index.w-full.h-full
  ComComAdminPaperTrailVersionsIndex
</template>
