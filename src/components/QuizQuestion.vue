<template lang="pug">
Cover.quiz-question
  h1 {{ text.question }}

  b-button(v-for="(answer, key, index) in text.answers" @click="submit(key + 1)") {{ answer }}
</template>

<script>
import Cover from './Cover';

export default {
  name: 'QuizQuestion',
  props: {
    text: {
      question: String,
      answers: Array,
    },
    submit: Function
  },
  components: {
    Cover
  }
}
</script>

<style lang="scss">
</style>
