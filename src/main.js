import 'babel-polyfill';
import 'core-js';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store';
import vuetify from './plugins/vuetify';
import moment from 'vue';
import vueMoment from 'vue-momentjs';
import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader
import vueCookies from 'vue-cookies';

Vue.config.productionTip = false;
Vue.use(vueMoment, moment );
Vue.use(vueCookies);
// Vue.prototype.$axios = axios

new Vue({
  router,
  methods: {
    hashChangeHandler: function () {
      var target = window.location.hash;
      this.$router.push(target.substring(1, target.length));
    },
  },
  mounted: function () {
    // fix for IE 11
    if (!!window.MSInputMethodContext && !!document.documentMode) {
      window.addEventListener('hashchange', this.hashChangeHandler);
    }
  },
  destroyed: function () {
    // fix for IE 11
    if (!!window.MSInputMethodContext && !!document.documentMode) {
      window.removeEventListener('hashchange', this.hashChangeHandler);
    }
  },
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
