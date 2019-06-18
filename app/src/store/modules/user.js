import * as fb from 'firebase'

export default {
    namespaced: true,
    state: {
        user: null
    },
    mutations: {
        setUser(state, userInfo) {
            state.user = userInfo;
        },
        logout(state) {
            state.user = null;
        }
    },
    actions: {
        registerUser(state, user) {
           fb.auth().createUserWithEmailAndPassword(user.email, user.password)
           .then((registeredUser) => {
               state.commit('setUser', registeredUser)

               fb.auth().currentUser.updateProfile({
                   displayName: user.login,
                   photoURL: user.image
               });
               
           }); 
        },
        loginUser({commit}, {email, password}) {
            return fb.auth().signInWithEmailAndPassword(email, password)
        },
        autoLogin({commit}, payload) {
            commit('setUser', payload);
        },
        logoutUser({commit}) {
            fb.auth().signOut();
            commit("logout");
        }
    },
    getters: {
        user(state) {
            return state.user;
        },
        isLoggedIn(state) {
            return state.user !== null;
        }
    }
}