<template lang="pug">
Cover.quiz-question(:class="text.class")
  h1 {{ text.question }}
  h2(v-if="quantityText") {{ quantityText }}
  p(v-if="timeRemaining") time reMAINing: {{ timeRemaining }}

  b-button(v-for="(answer, key, index) in text.answers" @click="submit(key + 1)" class="btn-quiz" :key="key" :style="{ backgroundColor: hexColor(key) }") {{ answer }}
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
  mounted() {

  },
  methods: {
    hexColor(key) {
      if (!this.text.colors) {
        return null;
      }

      const hue = this.text.colors[key];

      if (!hue) {
        return null;
      }

      // https://gka.github.io/chroma.js/
      return chroma.hsl(hue, 1, 0.4);
    },
  },
  computed: {
    quantityText() {
      if (this.text.quantity === 'multiple') {
        return "chooZ as manY tIMez as yOUd like:"
      } else if (this.text.quantity === 'single') {
        return "chooZ only ONCE & careFullY:";
      } else {
        return "";
      }
    },
    timeRemaining() {

    }
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
