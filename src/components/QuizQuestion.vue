<template lang="pug">
Cover.quiz-question(:class="text.class")
  h1 {{ text.question }}

  b-button(v-for="(answer, key, index) in text.answers" @click="submit(key + 1)" :key="key") {{ answer }}
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
.living-room{
  background: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('~@/assets/images/living_room.jpg');
  background-position: center;
  background-size: cover;
}
.chair{
  background: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('~@/assets/images/chair.jpg');
  background-size: contain;
}
.chuck-norris{
  background: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('~@/assets/images/chuck_norris.gif');
  background-size: contain;
}
.doughnuts{
  background: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('~@/assets/images/doughnuts.gif');
  background-size: contain;
}
</style>
