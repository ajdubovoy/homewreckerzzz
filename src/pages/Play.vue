<template lang="pug">
.play
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
  computed: {
    ...mapGetters([
      'initialized'
    ])
  }
}
</script>

<style lang="scss">
</style>
