<script lang='ts'>
import { defineComponent, toRefs } from 'vue';
import { VStore } from '../../../../lib/vails/store/index';
import { SoaOauthSessionApi } from '../../apis/soa/oauth/session.api';
import { AuthSessionApi } from '../../apis/auth/session.api';
import { useSHA256Encrypt } from '@/components/global/ta-component/ta-template-form-core/useSHA256Encrypt';

let decodeCredential = (...rest: any) => { };
try {
  decodeCredential = require('vue3-google-login')?.decodeCredential
} catch (e) {
  console.log(e)
}

const ComGoogleButton = defineComponent({
  name: 'ComGoogleButton',
  components: {},
  props: {},
  setup(props, { emit }) {
    const googleStore = new VStore(new SoaOauthSessionApi({ encrypt: true }))
    const { decryptText } = useSHA256Encrypt()
    const callback = (response: any) => {
      const userData: any = decodeCredential(response.credential)

      googleStore.sendCollectionAction({
        action: 'account_create_bind',
        config: {
          data: {
            account: userData.email,
            open_id: userData.sub,
            oauth_app_id: 'mkb_google',
            app_id: 'MKB'
          }
        }
      }).then(async (res: any) => {
        const { token } = JSON.parse(decryptText(res.data.iv_encrypted, res.data.iv64) as any || {})
        await new AuthSessionApi().setToken(token)

        emit('success')
      })

    }
    return {
      ...toRefs(props),
      callback,
    };
  },
});
export default ComGoogleButton;
</script>

<template lang="pug">
GoogleLogin(:callback='callback',prompt auto-login)
  //- template(#default)
  //-   slot
</template>

<style lang="stylus" scoped></style>
