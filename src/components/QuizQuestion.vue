<template lang="pug">
Cover.quiz-question(:class="text.class")
  h1 {{ text.question }}

  b-button(v-for="(answer, key, index) in text.answers" @click="submit(key + 1)" class="btn-quiz" :key="key" :style="{ backgroundColor: hexColor(text.colors[key]) }") {{ answer }}
</template>

<script>
import chroma from 'chroma-js';
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
  methods: {
    hexColor(hue) {
      if (!hue) {
        return null;
      }

      // https://gka.github.io/chroma.js/
      return chroma.hsl(hue, 1, 0.4);
    },
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
.colors{
  background: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('~@/assets/images/colors.gif');
  background-size: contain;
}
.btn-quiz{
  background-blend-mode: multiply;
  text-shadow: 2px 2px rgba(0,0,0,0.5);
}
</style>
