<template lang="pug">
.play
  b-button(@click="sineInstrument.play()") Play
</template>

<script>
import { mapGetters } from 'vuex';
import SineInstrument from '../instruments/sine_instrument';

export default {
  name: 'Play',
  created() {
    this.sineInstrument = new SineInstrument(this.$store.state.audioContext);
  },
  mounted() {
    if (!this.initialized) {
      this.$router.push('/quiz');
    }
  },
  sockets: {
    play() {
      this.sineInstrument.play();
    }
  },
  computed: {
    ...mapGetters([
      'initialized'
    ])
  }
}
</script>

<style lang="scss">
</style>
