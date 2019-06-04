import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import store from './state/store.js';

import indexPage from "./view/index.vue";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(ElementUI);

const routes = [
  {path: '/', component: indexPage},
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
