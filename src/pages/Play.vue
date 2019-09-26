<template lang="pug">
.play
  Cover(v-if="!audioContext")
    h1 plz turn OFFFFF your content blockers and let me contRoL ur aud.io!
  Cover(v-else-if="!connected")
    h1 overcoming the teCHnical boundarIEs and CONNECTING...
  Cover(v-else-if="audioContext.state !== 'running'")
    h1 urgh, im expERIencING some issues with taking over ur speakeRS. Try tapping your screen
  Cover(v-else-if="Boolean(loadingText)")
    h1 {{ loadingText }}
  QuizQuestion(:text="quiz" :submit="handleQuizSubmit" v-else-if="quiz")
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import throttle from 'lodash.throttle';
import SineInstrument from '../instruments/sine_instrument';
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

    this.sineInstrument = new SineInstrument(this.audioContext);

    this.initiateLoadingText();
  },
  data() {
    return {
      connected: true, // Assume connected and only show message on disconnect
      quiz: null,
      loadingText: ""
    }
  },
  sockets: {
    connect() {
      this.connected = true;
    },
    disconnect() {
      this.connected = false;
      this.killInstrument(); // Kill sound on disconnect just in case
    },
    play(options) {
      if (this.isAudience(options.audience)) {
        // Only play if client is target audience
        this.findAndSetInstrument(options.instrument); // Set instrument based on integer value
        this.playingInstrument.play(options.controls); // Issue play command to selected instrument class instance
      }
    },
    kill(options) {
      if (this.isAudience(options.audience)) {
        // Only kill if client is target audience
        this.killInstrument(options);
      }
    },
    quizAsk(quiz) {
      this.quiz = quiz;
    },
    quizCompletion() {
      this.quiz = null;
    }
  },
  computed: {
    ...mapState([
      'audioContext',
      'playingInstrument',
      'confirmedConsent',
      'roomSection',
      'seatingHeight',
      'randomQuestion'
    ]),
    ...mapGetters([
      'initialized',
      'token'
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
</style>
