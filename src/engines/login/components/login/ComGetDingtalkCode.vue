<script>
import axios from 'axios';
import { defineComponent } from 'vue';

const ComGetDingtalkCode = defineComponent({
  name: 'ComGetDingtalkCode',
  components: {},
  props: {
    appid: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    apiUrl: { type: String, required: true },
  },
  data() {
    return {
      dingCodeConfig: {
        id: 'login_container', // 插入的id
        style: 'border:none;background-color:#FFFFFF;', // 样式
        width: '365',
        height: '400',
      },
    };
  },
  computed: {
    getRedirectUrl() {
      return encodeURIComponent(this.redirectUrl);
    },
    getAuthUrl() {
      return `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.appid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${this.getRedirectUrl}`;
    },
    getGoto() {
      return encodeURIComponent(this.getAuthUrl);
    },
    getDingCodeConfig() {
      return { ...this.dingCodeConfig, goto: this.getGoto };
    },
  },
  created() {
    //调用
    this.initDingJs();
  },
  mounted() {
    this.addDingListener();
    this.initDingLogin();
    this.getUser();
  },
  methods: {
    initDingJs() {
      !(function (window, document) {
        function d(a) {
          var e,
            c = document.createElement('iframe'),
            d = 'https://login.dingtalk.com/login/qrcode.htm?goto=' + a.goto;
          (d += a.style ? '&style=' + encodeURIComponent(a.style) : ''),
            (d += a.href ? '&href=' + a.href : ''),
            (c.src = d),
            (c.frameBorder = '0'),
            (c.allowTransparency = 'true'),
            (c.scrolling = 'no'),
            (c.width = a.width ? a.width + 'px' : '365px'),
            (c.height = a.height ? a.height + 'px' : '400px'),
            (e = document.getElementById(a.id)),
            (e.innerHTML = ''),
            e.appendChild(c);
        }

        window.DDLogin = d;
      })(window, document);
    },
    addDingListener() {
      let self = this;

      let handleLoginTmpCode = function (loginTmpCode) {
        window.location.href = self.getAuthUrl + `&loginTmpCode=${loginTmpCode}`;
      };

      let handleMessage = function (event) {
        if (event.origin == 'https://login.dingtalk.com') {
          handleLoginTmpCode(event.data);
        }
      };

      if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('message', handleMessage, false);
      } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onmessage', handleMessage);
      }
    },
    initDingLogin() {
      window.DDLogin(this.getDingCodeConfig);
    },
    getUser() {
      let getQueryString = function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return unescape(r[2]);
        }
        return null;
      };

      let code = getQueryString('code');

      if (code !== null) {
        axios
          .get(`${this.apiUrl}?code=${code}`)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
  },
});
export default ComGetDingtalkCode;
</script>
<template>
  <div id="dingtalk_login">
    <div id="login_container"></div>
  </div>
</template>
<style>
#dingtalk_login {
  margin-top: 60px;
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
