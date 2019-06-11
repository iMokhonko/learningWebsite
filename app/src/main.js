import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'

import App from './App.vue'
import { store } from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Vuelidate from 'vuelidate';


Vue.config.productionTip = true;

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(Vuelidate);
Vue.use(VueResource);


const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/users', component: () => import('./components/routerview.vue'),
    children: [
      { path: '/', component: () => import('./view/users/list.vue') },
      {
        path: 'add', component: () => import('./view/users/add.vue'),
        beforeEnter(to, from, next) {
          next(true);
        }
      }
    ]
  },
  {
    path: '*',
    component: () => import('./view/404.vue')
  }]
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
