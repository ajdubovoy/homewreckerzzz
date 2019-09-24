import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Bootstrap from 'bootstrap-vue';
import App from './App.vue';
import Index from './pages/Index';
import Llama from './pages/Llama';
import Play from './pages/Play';

Vue.config.productionTip = false;

// Routes

const routes = [
  { path: '/', component: Index },
  { path: '/lotta-llama', component: Llama },
  { path: '/play', component: Play }
];

const router = new Router({
  routes // short for `routes: routes`
});

Vue.use(Router);


// Store
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    roomSection: 0,
    seatingHeight: 0,
    randomQuestion: 0
  },
  mutations: {
    SET_ROOM_SECTION(state, section) {
      state.roomSection = section;
    },
    SET_SEATING_HEIGHT(state, height) {
      state.seatingHeight = height;
    },
    SET_RANDOM_QUESTION(state, answer) {
      state.randomQuestion = answer;
    }
  },
  actions: {
    setRoomSection({ commit }, section) {
      commit('SET_ROOM_SECTION', section);
    },
    setSeatingHeight({ commit }, height) {
      commit('SET_SEATING_HEIGHT', height);
    },
    setRandomQuestion({ commit }, answer) {
      commit('SET_RANDOM_QUESTION', answer);
    }
  },
  getters: {
    initialized(state) {
      // Tell if the questions have been answered
      return state.roomSection && state.seatingHeight && state.randomQuestion;
    },
    roomSectionString(state) {
      // Enum
      return ['uninitialized', 'couch', 'table', 'door'][state.roomSection];
    },
    seatingHeightString(state) {
      // Enum
      return ['uninitialized', 'floor', 'couch', 'chair', 'standing'][state.seatingHeight];
    },
    randomQuestionString(state) {
      // Enum
      return ['uninitialized', 'chuckNorris', 'llama', 'pineapple'][state.randomQuestion];
    }
  },
  plugins: [createPersistedState()]
});

Vue.use(Bootstrap);

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
