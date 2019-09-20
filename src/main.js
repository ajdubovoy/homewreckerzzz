import Vue from 'vue';
import Router from 'vue-router';
import Bootstrap from 'bootstrap-vue';
import App from './App.vue';
import Index from './pages/Index';
import Llama from './pages/Llama';
import Play from './pages/Play';

Vue.config.productionTip = false;

const routes = [
  { path: '/', component: Index },
  { path: '/lotta-llama', component: Llama },
  { path: '/play', component: Play }
];

const router = new Router({
  routes // short for `routes: routes`
});

Vue.use(Router);

Vue.use(Bootstrap);

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
