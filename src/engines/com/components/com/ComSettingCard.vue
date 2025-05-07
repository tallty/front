<script lang="ts">
import { ref, defineComponent, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import defaultImg from '@/engines/com/assets/images/organization.png';

const ComSettingCard = defineComponent({
  name: 'ComSettingCard',
  components: {},
  props: {
    name: { type: String, default: '卡片名称' },
    img: { type: String, default: defaultImg },
    url: { type: String, default: '' },
  },
  setup(props) {
    const router = useRouter();
    const toUrl = () => {
      if (props.url) {
        router.push(props.url);
      }
    };
    return {
      ...toRefs(props),
      toUrl,
    };
  },
});
export default ComSettingCard;
</script>

<template lang="pug">
.setting-card(@click='toUrl')
  img.img(:src='img')
  .name {{ name }}
</template>

<style lang="stylus" scoped>
.setting-card
  width: 130px;
  height: 130px;
  cursor pointer
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #E5E5E5;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
.img
  height 40px
.name
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #383838;
  margin-top 20px
</style>
