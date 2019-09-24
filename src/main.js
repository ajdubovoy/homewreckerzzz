import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import VueSocketIO from 'vue-socket.io'
import Bootstrap from 'bootstrap-vue';
import App from './App.vue';
import Index from './pages/Index';
import Llama from './pages/Llama';
import Play from './pages/Play';
import Quiz from './pages/Quiz';
import Puppeteer from './pages/Puppeteer';

Vue.config.productionTip = false;

// Routes

const routes = [
  { path: '/', component: Index },
  { path: '/lotta-llama', component: Llama },
  { path: '/play', component: Play },
  { path: '/quiz', component: Quiz },
  { path: '/puppeteer', component: Puppeteer }
];

const router = new Router({
  routes // short for `routes: routes`
});

Vue.use(Router);


// Store
Vue.use(Vuex);

const AudioContext = window.AudioContext || window.webkitAudioContext;

const store = new Vuex.Store({
  state: {
    key: Math.random().toString(36).substr(2, 9), // Generate random key
    roomSection: 0,
    seatingHeight: 0,
    randomQuestion: 0,
    audioContext: new AudioContext(),
    playingInstrument: null,
    puppeteer: false
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
    },
    MAKE_PUPPETEER(state) {
      state.puppeteer = true
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
    },
    makePuppeteer({ commit }, password) {
      if (password === 'iamgkap720') {
        commit('MAKE_PUPPETEER')
      }
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
    },
    currentQuizSection({ roomSection, seatingHeight, randomQuestion }) {
      // Returns an integer from 0-3 depending on how many of the quiz questions the person has answered. Useful for Quiz component.
      if (!roomSection) {
        return 0;
      } else if (!seatingHeight) {
        return 1;
      } else if (!randomQuestion) {
        return 2;
      } else {
        return 3;
      }
    }
  },
  plugins: [createPersistedState({
    paths: ['key', 'roomSection', 'seatingHeight', 'randomQuestion', 'puppeteer']
  })]
});

// Sockets
const sockets = new VueSocketIO({
  // debug: process.env.NODE_ENV === 'production',
  debug: true,
  connection: '/socket',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
});

Vue.use(sockets);

Vue.use(Bootstrap);

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
