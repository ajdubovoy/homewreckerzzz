<template lang="pug">
Cover.quiz-question(:class="text.class")
  h1 {{ text.question }}
  h2(v-if="quantityText") {{ quantityText }}
  p(v-if="timeRemaining()") you hAve oNLy so maNY seCONDS: {{ timeRemaining() }}

  b-button(v-for="(answer, key, index) in text.answers" @click="handleSubmit(key + 1)" class="btn-quiz" :key="key" :style="{ backgroundColor: hexColor(key, answers[key + 1]) }") {{ answer }}
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
    this.interval = setInterval(() => {
      this.now = new Date();
      this.timeRemaining();
    }, 500);
  },
  data() {
    return {
      answers: {},
      interval: null,
      now: new Date()
    }
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    hexColor(answer, count) {
      if (!this.text.colors) {
        return null;
      }

      const hue = this.text.colors[answer];

      if (!hue) {
        return null;
      }

      const totalAnswers = Object.values(this.answers).reduce((a, b) => a + b, 0);
      let saturation = count ? (count / totalAnswers) : 0;
      if (!totalAnswers) {
        saturation = 1;
      }

      // https://gka.github.io/chroma.js/
      return chroma.hsl(hue, saturation, 0.5);
    },
    timeRemaining() {
      const duration = this.text.duration;
      const time = new Date(this.text.time);

      if (!duration || !time) {
        return 0;
      }

      const difference = duration - (this.now - time);
      if (difference <= 0) {
        return 0;
      }
      return Math.round(difference / 1000);
    },
    handleSubmit(answer) {
      const element = event.target;
      element.classList.add('pop');
      setTimeout(() => {
        element.classList.remove('pop');
      }, 150)

      if (this.answers[answer]) {
        this.answers[answer] += 1;
      } else {
        this.answers[answer] = 1;
      }

      this.submit(answer);
    }
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
    }
  },
  components: {
    Cover
  }
}
</script>

<style lang="scss">
@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
    color: transparent;
    background-clip: text;
    font-size: 2em;
  }
  100% {
    transform: scale(1);
  }
}
.living-room{
  background: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('~@/assets/images/silent_green.jpg');
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
.numbers{
  background: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('~@/assets/images/numbers.gif');
  background-size: contain;
}
.btn-quiz{
  background-blend-mode: multiply;
  text-shadow: 2px 2px rgba(0,0,0,0.5);
}
.pop{
  animation-name: pop;
  animation-duration: 150ms;
  animation-iteration-count: 1;
}
</style>
