import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import { getWechatCode, getWechatOpenid, clearCodeFromUrl, wechatSilentAuth } from './utils/wechat'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(Vant)

app.mount('#app')

/**
 * 应用启动时进行微信授权
 */
const initWechatAuth = async () => {
  const code = getWechatCode();
  
  if (store.getters.isAuthorized) {
    console.log('已授权，openid:', store.getters.getOpenid);
    clearCodeFromUrl();
    return;
  }
  
  if (code) {
    try {
      const openid = await getWechatOpenid(code);
      if (openid) {
        store.commit('setOpenid', openid);
        clearCodeFromUrl();
        console.log('微信授权成功，openid:', openid);
      }
    } catch (error) {
      console.error('微信授权失败:', error);
    }
  } else {
    console.log('未检测到微信授权code，开始授权');
    wechatSilentAuth();
  }
};

initWechatAuth();
