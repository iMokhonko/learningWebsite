import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'

import App from './App.vue'
import { store } from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Vuelidate from 'vuelidate';

import * as fb from 'firebase';

Vue.config.productionTip = true;

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(Vuelidate);
Vue.use(VueResource);

Vue.http.interceptors.push((request) => {
  console.log("request two");
});

Vue.http.interceptors.push((request) => {
  console.log("request one");
});

const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/users', component: () => import('./components/routerview.vue'),
    children: [
      {
        path: '/', component: () => import('./view/users/list.vue'),
        meta: {
          bread: [{
            'name': 'Homepage',
            'url': '/',
          }, {
            'name': 'Users',
            'url': '/users',
          }]
        }
      },
      {
        path: 'add', component: () => import('./view/users/add.vue'),
        meta: {
          bread: [{
            'name': 'Homepage',
            'url': '/',
          }, {
            'name': 'Users',
            'url': '/users',
          }, {
            'name': 'Add',
            'url': '/users/add',
          }]
        },
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
  created() {
    var firebaseConfig = {
      apiKey: "AIzaSyApmE7KmHWBKB9M0MvfpTsEB3OqnDXbNpM",
      authDomain: "usersdb-7a597.firebaseapp.com",
      databaseURL: "https://usersdb-7a597.firebaseio.com",
      projectId: "usersdb-7a597",
      storageBucket: "usersdb-7a597.appspot.com",
      messagingSenderId: "823664992906",
      appId: "1:823664992906:web:ff1dd41192bc7573"
    };
    fb.initializeApp(firebaseConfig);
  }
}).$mount('#app')
