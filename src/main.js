import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Bootstrap from 'bootstrap-vue';
// import VueSocketIOExt from 'vue-socket.io-extended';
// import io from 'socket.io-client';
import AudioContext from './helpers/audio_context';
import App from './App.vue';
import Index from './pages/Index';
import Llama from './pages/Llama';
import Play from './pages/Play';
import Quiz from './pages/Quiz';
import Puppeteer from './pages/Puppeteer';
import Visualize from './pages/Visualize';

Vue.config.productionTip = false;

// Routes

const routes = [
  { path: '/', component: Index },
  { path: '/lotta-llama', component: Llama },
  { path: '/play', component: Play },
  { path: '/quiz', component: Quiz },
  { path: '/puppeteer', component: Puppeteer },
  { path: '/visualize', component: Visualize }
];

const router = new Router({
  routes // short for `routes: routes`
});

Vue.use(Router);


// Store
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: Math.random().toString(36).substr(2, 9), // Generate random key
    roomSection: 0,
    randomQuestion: 0,
    team: 0, // Team piano or team sax :)
    audioContext: new AudioContext(),
    playingInstrument: null,
    puppeteer: false,
    confirmedConsent: false,
    buffers: []
  },
  mutations: {
    SET_ROOM_SECTION(state, section) {
      state.roomSection = section;
    },
    SET_RANDOM_QUESTION(state, answer) {
      state.randomQuestion = answer;
    },
    SET_TEAM(state, answer) {
      state.team = answer;
    },
    MAKE_PUPPETEER(state) {
      state.puppeteer = true
    },
    SET_PLAYING_INSTRUMENT(state, instrument) {
      state.playingInstrument = instrument;
    },
    CONFIRM_CONSENT(state) {
      state.confirmedConsent = true;
    }
  },
  actions: {
    setRoomSection({ commit }, section) {
      commit('SET_ROOM_SECTION', section);
    },
    setRandomQuestion({ commit }, answer) {
      commit('SET_RANDOM_QUESTION', answer);
    },
    setTeam({ commit }, answer) {
      commit('SET_TEAM', answer);
    },
    makePuppeteer({ commit }, password) {
      if (password === 'iamgkap720') {
        commit('MAKE_PUPPETEER');
      }
    },
    setPlayingInstrument({ commit }, instrument) {
      commit('SET_PLAYING_INSTRUMENT', instrument);
    },
    confirmConsent({ commit }) {
      commit('CONFIRM_CONSENT');
    }
  },
  getters: {
    initialized(state) {
      // Tell if the questions have been answered
      return state.roomSection && state.randomQuestion;
    },
    roomSectionString(state) {
      // Enum
      return ['uninitialized', 'couch', 'table', 'door'][state.roomSection];
    },
    randomQuestionString(state) {
      // Enum
      return ['uninitialized', 'chuckNorris', 'llama', 'pineapple'][state.randomQuestion];
    },
    teamString(state) {
      // Enum
      return ['uninitialized', 'piano', 'sax'][state.team];
    },
    currentQuizSection({ roomSection, randomQuestion }) {
      // Returns an integer from 0-3 depending on how many of the quiz questions the person has answered. Useful for Quiz component.
      if (!roomSection) {
        return 0;
      } else if (!randomQuestion) {
        return 1;
      } else {
        return 2;
      }
    }
  },
  plugins: [createPersistedState({
    paths: ['token', 'roomSection', 'randomQuestion', 'puppeteer', 'team']
  })]
});

// // Sockets
// const socket = io(process.env.SERVER_URI);

// Vue.use(VueSocketIOExt, socket);

Vue.use(Bootstrap);

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
