<template lang="pug">
.play
  .deep-fried(v-if="deepFried")
  QuizQuestion(:text="quiz" :submit="handleQuizSubmit" v-if="quiz")
  Cover(v-else)
    h1(v-if="!connected")
      | overcoming the teCHnical boundarIEs and CONNECTING...
    h1(v-if="Boolean(loadingText)")
      | {{ loadingText }}
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import throttle from 'lodash.throttle';
import WaveInstrument from '../instruments/wave_instrument';
import ClusterInstrument from '../instruments/cluster_instrument';
import Cover from '../components/Cover';
import QuizQuestion from '../components/QuizQuestion';
import instruments from '../data/instruments';

export default {
  name: 'Play',
  mounted() {
    if (!this.initialized) {
      this.$router.push('/quiz');
    } else if (!this.confirmedConsent && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // Go back home if iOS user hasn't enabled WebAudio yet
      this.$router.push('/');
    }

    this.waveInstrument = new WaveInstrument(this.audioContext);
    this.clusterInstrument = new ClusterInstrument(this.audioContext);

    this.initiateLoadingText();
  },
  data() {
    return {
      connected: true, // Assume connected and only show message on disconnect
      quiz: null,
      loadingText: "",
      deepFried: false,
      playing: false
    }
  },
  sockets: {
    connect() {
      this.connected = true;
    },
    disconnect() {
      this.connected = false;
      this.killInstrument(); // Kill sound on disconnect just in case
      this.quiz = null; // Also turn off quiz mode
    },
    play(options) {
      if (this.isAudience(options.audience)) {
        // Only play if client is target audience
        if (this.playing) {
          // Prevent two play commands from overlapping
          this.killInstrument(options);
        }
        this.findAndSetInstrument(options.instrument); // Set instrument based on integer value
        this.playingInstrument.play(options.controls); // Issue play command to selected instrument class instance
        this.$socket.client.emit('clientPlay', {
          token: this.token,
          options
        });
        this.playing = true;
      }
    },
    kill(options) {
      if (this.isAudience(options.audience)) {
        // Only kill if client is target audience
        this.killInstrument(options);
        this.$socket.client.emit('clientKill', {
          token: this.token,
          options
        });
        this.playing = false;
      }
    },
    quizAsk(quiz) {
      if (this.isAudience(quiz)) {
        this.notificationPing();
        this.quiz = quiz;
      }
    },
    quizCompletion() {
      this.quiz = null;
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
    }
  },
  computed: {
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
      this.$socket.client.emit('quizResponse', {
        clientID: this.$store.state.token,
        value: response
      });
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
.deep-fried{
  height: 100vh;
  width: 100vw;
  position: fixed;
  pointer-events: none;
  backdrop-filter: saturate(5) contrast(5) hue-rotate(30deg) blur(0px); // the deep frying
  animation: hotMess 2s infinite alternate;
}
</style>
