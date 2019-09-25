<template lang="pug">
.play
  Cover(v-if="!audioContext")
    h1 plz turn OFFFFF your content blockers and let me contRoL ur aud.io!
  Cover(v-else-if="!connected")
    h1 overcoming the teCHnical boundarIEs and CONNECTING...
  QuizQuestion(:text="quizProps()" :submit="handleQuizSubmit" v-if="quiz")
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import throttle from 'lodash.throttle';
import SineInstrument from '../instruments/sine_instrument';
import Cover from '../components/Cover';
import QuizQuestion from '../components/QuizQuestion';

export default {
  name: 'Play',
  mounted() {
    if (!this.initialized) {
      this.$router.push('/quiz');
    }
    this.sineInstrument = new SineInstrument(this.audioContext);
  },
  data() {
    return {
      connected: true, // Assume connected and only show message on disconnect
      quiz: null
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
      this.setPlayingInstrument(this.sineInstrument);
      this.playingInstrument.play(options);
    },
    kill(options) {
      this.killInstrument(options);
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
      'playingInstrument'
    ]),
    ...mapGetters([
      'initialized',
      'token'
    ])
  },
  methods: {
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
    quizProps() {
      return {
        question: this.quiz.question,
        answers: this.quiz.answers
      }
    }
  },
  components: {
    Cover,
    QuizQuestion
  }
}
</script>

<style lang="scss">
</style>
