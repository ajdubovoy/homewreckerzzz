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
    b-button(@click="handlePlay" variant="primary") Play
    b-button(@click="handleKill" variant="danger") THE massive KILL SWITCH
    b-form-group
      b-form-checkbox(v-model="sustain") Sustain Mode
    b-form-group
      label(for="amplitude") Amplitude: {{ amplitudePercentage }}%
      b-form-input(id="amplitude" v-model="amplitude" type="range" min="0" max="128")
    b-form-group
      label(for="frequency") Frequency: {{ pitchName }}
      b-form-input(id="frequency" v-model="frequency" type="range" min="0" max="128")
    h3 Quizzes
    b-form-group
      b-form-select(v-model="quiz" :options="quizOptions()")
    b-button(type="submit" variant="primary" :disabled="quiz === 0" @click="handleQuiz") Start Jeopardy Time
</template>

<script>
import { mapState, mapActions } from 'vuex';
import midiToName from '../helpers/midi_to_name';
import Cover from '../components/Cover';
import BlinkyText from '../components/BlinkyText';
import quizzes from '../data/quizzes';

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
      amplitude: 100,
      frequency: 60,
      quiz: 0
    };
  },
  computed: {
    pitchName() {
      return midiToName(this.frequency);
    },
    amplitudePercentage() {
      return Math.round(this.amplitude / 128 * 100);
    },
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
    onMIDISuccess(midiAccess) {
      // https://www.smashingmagazine.com/2018/03/web-midi-api/
      this.socketMessage = "Gained access to your MIDI device!";
      for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = this.getMIDIMessage;
      }
    },
    getMIDIMessage(message) {
      const [, note, velocity] = message; // Assign the MIDI message data to useable variables and disregard the first (command) for now

      switch (note) {
        // Translate slider input into appropriate state change
        case 1:
          this.amplitude = velocity;
          break;
        case 3:
          this.frequency = velocity;
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
    handleQuiz() {
      const quiz = quizzes[this.quiz - 1];
      if (quiz) {
        this.socketMessage = 'Sending quiz request...';
        this.$socket.client.emit('puppetQuiz', quiz);
        this.resetData('Quiz request sent: ' + quiz.title);
      } else {
        this.socketMessage = 'why dont U seleCT a quiZ!?!?';
      }
    },
    resetData(message = "Back to basics") {
      Object.assign(this.$data, this.$options.data.call(this));
      this.socketMessage = message;
    },
    quizOptions() {
      return [
        { value: 0, text: 'Please select a quiz' },
        ...quizzes.map((quiz, index) => { 
          return { 
            value: index + 1, 
            text: quiz.title 
          };
        })
      ];
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
    },
    quizTally(payload) {
      this.socketMessage = 'The results are coming: ' + payload.responses.length
    },
    quizCompletion(payload) {
      this.socketMessage = 'The results are in :) Quiz over with ' + payload.responses.length + ' responses'
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
