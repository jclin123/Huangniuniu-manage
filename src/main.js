import Vue from "vue";
// 注意引入在 Vue的下面
//  ElementUI 组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import config from './config';
import './http'
import qs from 'qs'
import store from './state'


//Vue.prototype.$cookie = cookie;  //配置时候prototype.$这里的名字自己定义不是固定是cookie

//Vue.use(config);
// 使用 ElementUI
Vue.use(ElementUI);
Vue.prototype.$qs = qs;
//Vue.prototype.$store = store;
Vue.prototype.$bus = new Vue();

// 权限拦截
import './permission'

Vue.config.productionTip = false

//Vue.config.productionTip = process.env.NODE_ENV === 'production';
//console.log(process.env.VUE_APP_SERVICE_URL) // 开发环境 development, 生产环境 production

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
