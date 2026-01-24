import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Vant from 'vant'  // 引入Vant组件库
import 'vant/lib/index.css'  // 引入Vant样式

const app = createApp(App)
app.use(router)
app.use(Vant)  // 全局注册Vant组件
app.mount('#app')
