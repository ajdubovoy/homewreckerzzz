<template lang="pug">
.play
  .deep-fried(v-if="deepFried")
  .synesthesia(:class = "{playing: playing && !quiz, clicking: clicking && !quiz, fast: density > 5, fastest: density > 10}" :style="{ backgroundColor: hexColor}")
    Cover#finale(v-if="isFinale" :class = "{finale: this.finale, 'chuck-norris': randomQuestion === 0, llama: randomQuestion === 1, pineapple: randomQuestion === 2}")
      h1
        | thnX für gettINg wreCked
      h2
        | we really appreciate u 😘
    QuizQuestion(:text="quiz" :submit="handleQuizSubmit" v-else-if="quiz")
    Cover(v-else)
      h1(v-if="!connected")
        | overcoming the teCHnical boundarIEs and CONNECTING...
      h1(v-if="Boolean(loadingText)")
        | {{ loadingText }}
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import throttle from 'lodash.throttle';
import chroma from 'chroma-js';
import axiosClient from '../helpers/axios_client';
import WaveInstrument from '../instruments/wave_instrument';
import ClusterInstrument from '../instruments/cluster_instrument';
import ClicksInstrument from '../instruments/clicks_instrument';
import Cover from '../components/Cover';
import QuizQuestion from '../components/QuizQuestion';
import instruments from '../data/instruments';

export default {
  name: 'Play',
  mounted() {
    this.timer = setInterval(this.getSockets, this.updateDuration);

    if (!this.initialized) {
      this.$router.push('/quiz');
    } else if (!this.confirmedConsent && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // Go back home if iOS user hasn't enabled WebAudio yet
      this.$router.push('/');
    }

    this.waveInstrument = new WaveInstrument(this.audioContext);
    this.clusterInstrument = new ClusterInstrument(this.audioContext);
    this.clicksInstrument = new ClicksInstrument(this.audioContext);

    this.initiateLoadingText();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  data() {
    return {
      connected: true, // Assume connected and only show message on disconnect
      quiz: null,
      loadingText: "",
      deepFried: false,
      playing: false,
      isFinale: false,
      completedSockets: [],
      updateDuration: 300,
      executedSockets: [],
      connectedTime: new Date()
    }
  },
  computed: {
    hexColor() {
      let color = {h: 0, s: 0, l: 0};

      if (this.playing) {
        color = this.playingInstrument.color();
      }

      // https://gka.github.io/chroma.js/
      return chroma(color).hex();
    },
    clicking() {
      return this.playingInstrument === this.clicksInstrument;
    },
    density() {
      if (!this.clicking) {
        return 0;
      }
      return this.playingInstrument.density();
    },
    ...mapState([
      'audioContext',
      'playingInstrument',
      'confirmedConsent',
      'roomSection',
      'seatingHeight',
      'randomQuestion',
      'token'
    ]),
    ...mapGetters([
      'initialized'
    ])
  },
  methods: {
    getSockets() {
      axiosClient.get('sockets')
        .then((r) => {
          const sockets = r.data.sockets;
          this.executeSockets(sockets);
          this.connected = true;
        })
        .catch(() => {
          this.connected = false;
        });
    },
    executeSockets(sockets) {
      sockets.forEach((socket) => {
        if (new Date(socket.time) > this.connectedTime && !this.executedSockets.find(s => s.token === socket.token)) {
          try {
            this[socket.message](socket.request); // Execute the related method for that socket's message
            this.executedSockets.push(socket);
          } catch {
            this.connected = false;
          }
        }
      })
    },
    // SOCKETS

    // connect() {
      // this.connected = true;
    // },
    // disconnect() {
      // this.connected = false;
      // this.killInstrument(); // Kill sound on disconnect just in case
      // this.playing = false;
      // this.deepFried = false;
      // this.quiz = null; // Also turn off quiz mode
    // },
    play(options) {
      if (this.isAudience(options.audience)) {
        // Only play if client is target audience
        if (this.playing) {
          // Prevent two play commands from overlapping
          this.killInstrument(options);
        }
        this.findAndSetInstrument(options.instrument); // Set instrument based on integer value
        this.playingInstrument.play(options.controls); // Issue play command to selected instrument class instance
        this.playing = true;
      }
    },
    update(options) {
      if (this.isAudience(options.audience)) {
        // Only play if client is target audience
        if (this.playing) {
          const instrumentName = instruments[options.instrument];
          const instrumentInstance = this[instrumentName];
          if (this.playingInstrument === instrumentInstance) {
            this.playingInstrument.update(options.controls); // Issue play command to selected instrument class instance
          } else {
            this.killInstrument(options);
            this.findAndSetInstrument(options.instrument); // Set instrument based on integer value
            this.playingInstrument.play(options.controls); // Issue play command to selected instrument class instance
          }
        }
      }
    },
    kill(options) {
      if (this.isAudience(options.audience) && this.playing) {
        // Only kill if client is target audience
        this.killInstrument(options);
        this.playing = false;
      }
    },
    quizAsk(quiz) {
      if (this.isAudience(quiz)) {
        this.notificationPing();
        this.quiz = quiz;
      }
    },
    quizComplete(quiz) {
      if (this.isAudience(quiz)) {
        this.quiz = null;
      }
    },
    deepFry(fry) {
      if (this.isAudience(fry)) {
        this.deepFried = true;
      }
    },
    unDeepFry(fry) {
      if (this.isAudience(fry)) {
        this.deepFried = false;
      }
    },
    finale() {
      if (this.playing) {
        this.killInstrument();
      }
      this.isFinale = true;
    },
    // END SOCKETS
    initiateLoadingText() {
      this.loadingText = 'wReCkER'
      window.setTimeout(() => { this.loadingText = 'wrECKinggggg' }, 500);
      window.setTimeout(() => { this.loadingText = 'WRECKEDDDDD' }, 1000);
      window.setTimeout(() => { this.loadingText = 'GOOOOOOOOOOOOOO' }, 1500);
      window.setTimeout(() => { this.loadingText = ''}, 2500);
    },
    findAndSetInstrument(instrument) {
      const instrumentName = instruments[instrument]
      const instrumentInstance = this[instrumentName];
      this.setPlayingInstrument(instrumentInstance);
    },
    isAudience({ roomSection, seatingHeight, randomQuestion }) {
      // Makes sure current client satisfies 'audience' conditions
      const isRoomSection = roomSection ? roomSection == this.roomSection : true;
      const isSeatingHeight = seatingHeight ? seatingHeight == this.seatingHeight : true;
      const isRandomQuestion = randomQuestion ? randomQuestion == this.randomQuestion : true;
      return isRoomSection && isSeatingHeight && isRandomQuestion;
    },
    killInstrument(options = {}) {
      if (this.playingInstrument) {
        this.playingInstrument.kill(options);
      }
    },
    handleQuizSubmit(response) {
      this.throttledEmitQuizResponse(response);
    },
    throttledEmitQuizResponse: throttle(function(response) {
      // Throttle to prevent spamming
      axiosClient.post('quiz-responses', {
        message: 'quizResponse',
        clientID: this.$store.state.token,
        value: response
      })
    }, 750),
    notificationPing() {
      const playTone = (frequency) => {
        this.waveInstrument.play({
          sustain: false,
          amplitude: 110,
          frequency: frequency,
          waveType: 'sawtooth'
        });
      }

      playTone(72);

      // Double ping
      window.setTimeout(() => { playTone(68) }, 100);

      // Vibrate
      var canVibrate = "vibrate" in navigator || "mozVibrate" in navigator;

      if (canVibrate && !("vibrate" in navigator))
        navigator.vibrate = navigator.mozVibrate;

      if (canVibrate) {
        navigator.vibrate(500);
      }
    },
    ...mapActions([
      'setPlayingInstrument'
    ]),
  },
  components: {
    Cover,
    QuizQuestion
  }
}
</script>

<style lang="scss">
@keyframes hotMess {
  from { backdrop-filter: saturate(5) contrast(5) hue-rotate(30deg) blur(0px); }
  to { backdrop-filter: saturate(3) contrast(7) hue-rotate(60deg) blur(1px); }
}
@keyframes flicker {
  from { opacity: 0.7; }
  to { opacity: 1 }
}
@keyframes clicker {
  0% { transform: translateY(10%) translateX(-10%) scale(0.5, 0.5); }
  12% { transform: translateY(-3%) translateX(4%) scale(0.6, 0.4); }
  23% { transform: translateY(-5%) translateX(7%) scale(0.5, 0.5); }
  40% { transform: translateY(0%) translateX(3%) scale(0.5, 0.5); }
  55% { transform: translateY(12%) translateX(-3%) scale(0.4, 0.6); }
  70% { transform: translateY(-2%) translateX(6%) scale(0.6, 0.5); }
  90% { transform: translateY(4%) translateX(-4%) scale(0.5, 0.4); }
  93% { transform: translateY(-8%) translateX(-2%) scale(0.5, 0.5); }
  to { transform: translateY(-10%) translateX(10%) scale(0.5, 0.5); }
}
.deep-fried{
  height: 100vh;
  width: 100vw;
  position: fixed;
  pointer-events: none;
  backdrop-filter: saturate(5) contrast(5) hue-rotate(30deg) blur(0px); // the deep frying
  animation: hotMess 2s infinite alternate;
}
.synesthesia{
  transition: background-color 150ms ease;
  &.playing{
    animation: flicker 500ms infinite alternate;
    &.clicking{
      animation: clicker 750ms infinite alternate;
      &.faster{
        animation: clicker 400ms infinite alternate;
      }
      &.fastest{
        animation: clicker 200ms infinite alternate;
      }
    }
  }
}
.finale{
  &.llama{
    background-image: url('~@/assets/images/llama.gif');
  }
  &.chuck-norris{
    background-image: url('~@/assets/images/chuck_norris.gif');
  }
  &.pineapple{
    background-image: url('~@/assets/images/pineapple.gif');
  }
}
</style>
