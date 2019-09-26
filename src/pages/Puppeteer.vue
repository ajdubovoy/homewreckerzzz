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
    h3 scUlpt yo soUnd
    b-form-group
      label(for="instrument") Instrument
      b-form-select(name="instrument" v-model="instrument" :options="instrumentOptions()")
    b-form-group
      b-form-checkbox(v-model="sustain") Sustain Mode
    b-form-group
      label(for="amplitude") Amplitude: {{ amplitudePercentage }}%
      b-form-input(id="amplitude" v-model="amplitude" type="range" min="0" max="128")
    b-form-group
      label(for="frequency") Frequency: {{ pitchName }}
      b-form-input(id="frequency" v-model="frequency" type="range" min="0" max="128")
    b-form-group(v-if="instrument === 1")
      label(for="cluster-type") Cluster Type
      b-form-select(name="cluster-type" v-model="clusterType" :options="['major', 'minor', 'chromatic', 'random']")
    b-form-group
      label(for="wave-type") Wave Type
      b-form-select(name="wave-type" v-model="waveType" :options="['sine', 'square', 'sawtooth', 'triangle']")
    h3 Audience
    b-form-group
      label(for="room-section") Room Section
      b-form-select(name="room-section" v-model="roomSection" :options="{0: 'All', 1: 'Couch', 2: 'Dining Table', 3: 'Door'}")
    b-form-group
      label(for="seating-height") Seating Height
      b-form-select(name="seating-height" v-model="seatingHeight" :options="{0: 'All', 1: 'Floor', 2: 'Couch', 3: 'Chair', 4: 'Standing'}")
    b-form-group
      label(for="random-question") Random Question
      b-form-select(name="randon-question" v-model="randomQuestion" :options="{0: 'All', 1: 'Chuck Norris', 2: 'Llama', 3: 'Pineapple'}")
    h3 Quizzes
    b-form-group
      b-form-select(v-model="quiz" :options="quizOptions()")
    b-button(type="submit" variant="primary" :disabled="quiz === 0" @click="handleQuiz") Start Jeopardy Time
    h3 File Upload
    b-form(@submit.prevent="handleFileSubmit(userFile)" enctype="multipart/form-data" method="post" action="/api/file-upload")
      b-form-group
        b-form-file(accept="audio" name="userFile" v-model="userFile" :state="Boolean(userFile)" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here...")
        b-button(type="submit" variant="primary") Send it to the alIEnS
</template>

<script>
import { mapState, mapActions } from 'vuex';
import axios from 'axios';
import midiToName from '../helpers/midi_to_name';
import Cover from '../components/Cover';
import BlinkyText from '../components/BlinkyText';
import quizzes from '../data/quizzes';
import instruments from '../data/instruments';

export default {
  name: 'Puppeteer',
  mounted() {
    this.connectMIDI();
  },
  data() {
    return {
      password: '',
      socketMessage: "Loading...",
      sustain: true,
      amplitude: 100,
      frequency: 60,
      quiz: 0,
      userFile: null,
      instrument: 0,
      roomSection: 0,
      seatingHeight: 0,
      randomQuestion: 0,
      waveType: 'sine',
      clusterType: 'major'
    };
  },
  computed: {
    instrumentRequest() {
      return {
        instrument: this.instrument,
        audience: {
          roomSection: this.roomSection,
          seatingHeight: this.seatingHeight,
          randomQuestion: this.randomQuestion
        },
        controls: {
          sustain: this.sustain,
          amplitude: this.amplitude,
          frequency: this.frequency,
          waveType: this.waveType,
          clusterType: this.clusterType
        }
      }
    },
    pitchName() {
      return midiToName(this.frequency);
    },
    amplitudePercentage() {
      return Math.round(this.amplitude / 128 * 100);
    },
    instrumentName() {
      return instruments[this.instrument];
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
      const [, note, velocity] = message.data; // Assign the MIDI message data to useable variables and disregard the first (command) for now

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
      this.$socket.client.emit('puppetPlay', this.instrumentRequest);
      this.resetData('Play request sent');
    },
    handleKill() {
      // TODO rework with fuller featureset
      this.socketMessage = 'Sending kill request...';
      this.$socket.client.emit('puppetKill', this.instrumentRequest);
      this.resetData('Kill request sent');
    },
    handleQuiz() {
      const quiz = quizzes[this.quiz - 1];
      const audience = {
        roomSection: this.roomSection,
        seatingHeight: this.seatingHeight,
        randomQuestion: this.randomQuestion
      };
      if (quiz) {
        this.socketMessage = 'Sending quiz request...';
        this.$socket.client.emit('puppetQuiz', {...quiz, ...audience});
        this.resetData('Quiz request sent: ' + quiz.title);
      } else {
        this.socketMessage = 'why dont U seleCT a quiZ!?!?';
      }
    },
    handleFileSubmit() {
      const formData = new FormData();
      formData.append('userFile', this.userFile)
      axios({
        url: '/api/file-upload',
        method: 'post',
        data: formData
      })
        .then(() => {
          this.resetData('File uploaded');
        })
        .catch((error) => {
          this.socketMessage = `Urgurgurg, file wasn't uploaded and there was a status: ${error.response.status}`;
        });
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
    instrumentOptions() {
      return [
        ...instruments.map((instrument, index) => { 
          return { 
            value: index, 
            text: instrument
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
