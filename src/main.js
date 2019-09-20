import Vue from 'vue';
import Router from 'vue-router';
import Bootstrap from 'bootstrap-vue';
import App from './App.vue';
import Index from './pages/Index.vue';
import Llama from './pages/Llama.vue';

Vue.config.productionTip = false;

const routes = [
  { path: '/', component: Index },
  { path: '/lotta-llama', component: Llama }
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
