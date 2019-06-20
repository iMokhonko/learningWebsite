import Vue from 'vue'
import VueRouter from 'vue-router';

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


const router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/user', component: () => import('./components/routerview.vue'),
    children: [
      {
        path: '/', component: () => import('./view/users/profile.vue'),
        meta: {
          bread: [{
            'name': 'Homepage',
            'url': '/',
          }, {
            'name': 'Profile',
            'url': '/user',
          }]
        }
      },
      {
        path: 'register', component: () => import('./view/users/register.vue'),
        meta: {
          bread: [{
            'name': 'Homepage',
            'url': '/',
          }, {
            'name': 'Profile',
            'url': '/user',
          }, {
            'name': 'Add',
            'url': '/user/register',
          }]
        }
      },
      {
        path: 'login', component: () => import('./view/users/login.vue'),
        meta: {
          bread: [{
            'name': 'Homepage',
            'url': '/',
          }, {
            'name': 'Profile',
            'url': '/user',
          }, {
            'name': 'Login',
            'url': '/user/login',
          }]
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

    fb.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('userState/autoLogin', user);
      } else {
        this.$store.dispatch('userState/logoutUser');
      }
    });
  }
}).$mount('#app')
