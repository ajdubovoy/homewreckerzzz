<template lang="pug">
.quiz
  QuizQuestion(:text="questions.roomSection" :submit="setRoomSection" v-if="currentQuizSection === 0")
  QuizQuestion(:text="questions.randomQuestion" :submit="setRandomQuestion" v-if="currentQuizSection === 1")
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import QuizQuestion from '../components/QuizQuestion';

export default {
  name: 'Quiz',
  created() {
    // Static data
    this.questions = {
      roomSection: {
        question: "OK, dear mortal, I have to ask you some quick qUEstIons. I swear it's not painful. First off, which part of the room is nearest to you?",
        answers: [
          "Part 1",
          "Part 2",
          "Part 3",
          "Part 4"
        ],
        class: "living-room"
      },
      randomQuestion: {
        question: "In conclusion, EarTHliNG, PICK ONE FAST!",
        answers: [
          "Chuck Norris",
          "A Llama",
          "A Pineapple"
        ],
        class: 'chuck-norris'
      }
    }
  },
  mounted() {
    this.redirectOnCompletion();
  },
  updated() {
    this.redirectOnCompletion();
  },
  methods: {
    redirectOnCompletion() {
      if (this.initialized) {
        this.$router.push('/play');
      }
    },
    ...mapActions([
      'setRoomSection',
      'setSeatingHeight',
      'setRandomQuestion'
    ])
  },
  computed: {
    ...mapGetters([
      'initialized',
      'currentQuizSection'
    ])
  },
  components: {
    QuizQuestion
  }
}
</script>

<style lang="scss">
</style>
