<template lang="pug">
.play
  Cover(v-if="!audioContext")
    h1 plz turn OFFFFF your content blockers and let me contRoL ur aud.io!
  Cover(v-if="!connected")
    h1 overcoming the teCHnical boundarIEs and CONNECTING...
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
  data() {
    return {
      connected: false
    }
  },
  sockets: {
    connect() {
      this.connected = true;
    },
    disconnect() {
      this.connected = false;
      this.kill();
    },
    play(options) {
      this.setPlayingInstrument(this.sineInstrument);
      this.playingInstrument.play(options);
    },
    kill(options) {
      if (this.playingInstrument) {
        this.playingInstrument.kill(options);
      }
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
