import Vue from 'vue'
import Vuex from 'vuex'

import userState from './modules/user'

Vue.use(Vuex);


export const store = new Vuex.Store({
    modules: {
        userState
    }
});