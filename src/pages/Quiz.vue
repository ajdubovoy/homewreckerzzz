<template lang="pug">
.quiz
  QuizQuestion(:text="questions.roomSection" :submit="setRoomSection" v-if="currentQuizSection === 0")
  QuizQuestion(:text="questions.seatingHeight" :submit="setSeatingHeight" v-if="currentQuizSection === 1")
  QuizQuestion(:text="questions.randomQuestion" :submit="setRandomQuestion" v-if="currentQuizSection === 2")
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
        question: "OK, dear mortal, I have to ask you some quick qUEstIons. I swear it's not painful. First off, which part of the living room is nearest to you?",
        answers: [
          "The big couch 🛋",
          "The dining table 🍽",
          "The door 🚪"
        ],
        class: "living-room"
      },
      seatingHeight: {
        question: "Next up, what manner of seating hast thou chosen?",
        answers: [
          "On the floor 🛏",
          "On the couch 🛋",
          "On a chair 💺",
          "naw, im stAnDinG 🐥"
        ],
        class: "chair"
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
