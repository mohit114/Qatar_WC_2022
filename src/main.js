import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { firestorePlugin } from 'vuefire'
import { getAuth, onAuthStateChanged } from "firebase/auth";

Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created () {
    
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User        
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('getMatches')        
        // ...
      } else {
        // User is signed out
        // ...
        console.log('user is not logged in yet.');
      }
    });
  }
}).$mount('#app')
