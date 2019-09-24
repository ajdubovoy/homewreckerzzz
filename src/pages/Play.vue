<template lang="pug">
.play
  Cover(v-if="!audioContext")
    h1 plz turn OFFFFF your content blockers and let me contRoL ur aud.io!
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import SineInstrument from '../instruments/sine_instrument';

export default {
  name: 'Play',
  mounted() {
    if (!this.initialized) {
      this.$router.push('/quiz');
    }
    this.sineInstrument = new SineInstrument(this.audioContext);
  },
  sockets: {
    play(options) {
      this.setPlayingInstrument(this.sineInstrument);
      this.playingInstrument.play(options);
    },
    kill(options) {
      this.playingInstrument.kill(options);
    }
  },
  computed: {
    ...mapState([
      'audioContext',
      'playingInstrument'
    ]),
    ...mapGetters([
      'initialized'
    ])
  },
  methods: {
    ...mapActions([
      'setPlayingInstrument'
    ])
  }
}
</script>

<style lang="scss">
</style>
