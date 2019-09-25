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
    b-form-group
      label(for="amplitude") Amplitude
      b-form-input(id="amplitude" v-model="amplitude" type="range" min="0" max="128")
    b-form-group
      label(for="amplitude") Pitch
      b-form-input(id="amplitude" v-model="amplitude" type="range" min="0" max="128")
    b-button(@click="handlePlay") Play
    b-button(@click="handleKill" variant="danger") THE massive KILL SWITCH
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Cover from '../components/Cover';
import BlinkyText from '../components/BlinkyText';

export default {
  name: 'Puppeteer',
  mounted() {
    this.connectMIDI();
  },
  data() {
    return {
      password: '',
      socketMessage: "Loading...",
      sustain: false,
      amplitude: 100
    };
  },
  computed: {
    ...mapState([
      'puppeteer'
    ]),
  },
  methods: {
    connectMIDI() {
      if (navigator.requestMIDIAccess) {
        this.socketMessage = "WebMIDI initialized";
      } else {
        this.socketMessage = "WebMIDI could not be initialized urgh";
      }

      navigator.requestMIDIAccess()
        .then(this.onMIDISuccess, this.onMIDIFailure);
    },
    onMIDISuccess(message) {
      const [command, note, velocity] = message; // Assign the MIDI message data to useable variables

      switch (note) {
        // Translate slider input into appropriate state change
        case 1:
          this.amplitude = velocity;
          break;
        case 3:
          this.pitch = velocity;
          break;
      }
    },
    onMIDIFailure() {
      this.socketMessage = "Could not access your MIDI devices urgh";
    },
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
      this.resetData('Play request sent');
    },
    handleKill() {
      // TODO rework with fuller featureset
      this.socketMessage = 'Sending kill request...';
      this.$socket.client.emit('puppetKill');
      this.resetData('Kill request sent');
    },
    resetData(message = "Back to basics") {
      Object.assign(this.$data, this.$options.data.call(this));
      this.socketMessage = message;
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
    },
    kill() {
      this.socketMessage = 'Kill request successfully emitted';
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
