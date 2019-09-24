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
    b-form-checkbox(v-model="sustain") Sustain Mode
    b-button(@click="handlePlay") Play
    b-button(@click="handleKill" variant="danger") THE massive KILL SWITCH
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
  data() {
    return {
      password: '',
      socketMessage: "Loading...",
      sustain: false
    };
  },
  methods: {
    handleSubmit(password) {
      this.makePuppeteer(password);
      this.password = '';
    },
    handlePlay() {
      // TODO rework with fuller featureset
      this.socketMessage = 'Sending play request...';
      this.$socket.client.emit('puppetPlay', {
        sustain: this.sustain
      });
      this.resetData();
    },
    handleKill() {
      // TODO rework with fuller featureset
      this.socketMessage = 'Sending kill request...';
      this.$socket.client.emit('puppetKill');
      this.resetData();
    },
    resetData() {
      this.sustain = false;
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

    play() {
      this.socketMessage = 'Play request successfully emitted';
    }
  },
  components: {
    Cover,
    BlinkyText
  }
}
</script>

<style lang="scss">
</style>
