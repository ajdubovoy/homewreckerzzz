<template lang="pug">
.puppeteer
  Cover(v-if="!puppeteer")
    BlinkyText
      | Please authenticate yourself...or elseeeee (if ur not grEG get outtttt)
    b-form(@submit="handleSubmit(password)")
      b-form-group
        b-form-input(v-model='password' type='password') 
      b-button(type="submit" variant="primary") Unleash the Hounds
  Cover(v-else)
    h1
      | wilkOMmEn to ur excLUsivE dashBoARD, oh puppeTeeR GREG
    h2
      | I made it 'speciALLY für U with lovE and cArE
    b-alert(:variant="$socket.connected ? 'success' : 'danger'" show) {{ socketMessage }}
    b-button(@click="handlePlay") Play
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Cover from '../components/Cover';
import BlinkyText from '../components/BlinkyText';

export default {
  name: 'Puppeteer',
  computed: {
    ...mapState([
      'puppeteer'
    ]),
  },
  methods: {
    handleSubmit(password) {
      this.makePuppeteer(password);
      this.password = '';
    },
    handlePlay() {
      // TODO rework with fuller featureset
      this.socketMessage = 'Sending play request...';
      this.$socket.client.emit('puppetPlay');
    },
    ...mapActions([
      'makePuppeteer',
      'emitPlay'
    ])
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.socketMessage = "Successfully connected";
    },

    disconnect() {
      this.socketMessage = "Oops, you're offline!";
    },

    minionPlay() {
      this.socketMessage = 'Play request successfully emitted';
    }
  },
  data() {
    return {
      password: '',
      socketMessage: "Loading..."
    };
  },
  components: {
    Cover,
    BlinkyText
  }
}
</script>

<style lang="scss">
</style>
