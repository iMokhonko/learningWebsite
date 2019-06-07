import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import {store} from './store';

import routerview from "./components/routerview.vue";

import indexPage from "./view/index.vue";
import indexChildPage from './view/index-child.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = true;

Vue.use(VueRouter);
Vue.use(ElementUI);


const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/home', component: routerview,
    children: [
      {path: '/', component: indexPage},
      {path: 'child', component: indexChildPage}
    ]
  },
  {
    path: '/user', component: routerview,
    children: [
      {path: '/', component: indexChildPage},
      {path: 'ek', component: indexPage}
    ]
  }]
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
