<template lang="pug">
.module(:class="playing ? 'playing' : 'paused'")
  .deep-fried-module(v-if="deepFried")
  slot
  b-alert(:variant="$socket.connected ? 'success' : 'danger'" show) {{ socketMessage }}
  b-tabs
    b-tab(title="👨‍👨‍👧‍👦" active)
      b-form-group
        label(for="room-section") Room Section
        b-form-select(name="room-section" v-model="roomSection" :options="{0: 'All', 1: 'Couch', 2: 'Dining Table', 3: 'Door'}")
      b-form-group
        label(for="seating-height") Seating Height
        b-form-select(name="seating-height" v-model="seatingHeight" :options="{0: 'All', 1: 'Floor', 2: 'Couch', 3: 'Chair', 4: 'Standing'}")
      b-form-group
        label(for="random-question") Random Question
        b-form-select(name="randon-question" v-model="randomQuestion" :options="{0: 'All', 1: 'Chuck Norris', 2: 'Llama', 3: 'Pineapple'}")
    b-tab(title="🎹")
      b-button(@click="handlePlay" variant="primary") Play
      b-button(@click="handleKill" variant="danger") THE massive KILL SWITCH
      h3 scUlpt yo soUnd
      b-form-group
        b-form-group(label="Instrument")
          b-form-radio(v-model="instrument" name="instrument" v-for="i in instrumentOptions" :value="i.value") {{ i.text }}
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
    b-tab(title="❓")
      b-form-group
        b-form-select(v-model="quiz" :options="quizOptions()")
      b-button(type="submit" variant="primary" :disabled="quiz === 0" @click="handleQuiz") Start Jeopardy Time
    b-tab(title="🍩")
      h3 The Mysteries of Deep Frying Are Available to You
      b-button(variant="primary" @click="handleDeepFry" v-if="!deepFried") DEEP FRY WITH ALL OF GOD'S FURY
      b-button(variant="primary" @click="unDeepFry" v-else) Omg woops that made me feel high; undo
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import midiToName from '../helpers/midi_to_name';
import quizzes from '../data/quizzes';
import instruments from '../data/instruments';

export default {
  name: 'Module',
  data() {
    return {
      socketMessage: "Loading...",
      sustain: true,
      amplitude: 100,
      frequency: 60,
      quiz: 0,
      instrument: 0,
      roomSection: 0,
      seatingHeight: 0,
      randomQuestion: 0,
      waveType: 'sine',
      clusterType: 'major',
      playing: false,
      deepFried: false
    };
  },
  computed: {
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
    handlePlay() {
      // TODO rework with fuller featureset
      this.socketMessage = 'Sending play request...';
      this.$socket.client.emit('puppetPlay', this.instrumentRequest);
      this.socketMessage = 'Play request sent';
      this.playing = true;
    },
    handleKill() {
      // TODO rework with fuller featureset
      this.socketMessage = 'Sending kill request...';
      this.$socket.client.emit('puppetKill', this.instrumentRequest);
      this.socketMessage = 'Kill request sent';
      this.playing = false;
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
        this.socketMessage = 'Quiz request sent: ' + quiz.title;
      } else {
        this.socketMessage = 'why dont U seleCT a quiZ!?!?';
      }
    },
    handleDeepFry() {
      // TODO rework with fuller featureset
      this.socketMessage = 'Sending deep fry...';
      this.$socket.client.emit('puppetDeepFry', this.instrumentRequest);
      this.socketMessage = 'Fries have been fried';
      this.deepFried = true;
    },
    unDeepFry() {
      // TODO rework with fuller featureset
      this.socketMessage = 'Sending deep fry cancellation...';
      this.$socket.client.emit('unDeepFry', this.instrumentRequest);
      this.socketMessage = 'Fries have been unfried';
      this.deepFried = false;
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
          this.socketMessage = 'File uploaded';
        })
        .catch((error) => {
          this.socketMessage = `Urgurgurg, file wasn't uploaded and there was a status: ${error.response.status}`;
        });
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
    }
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
  }
}
</script>

<style lang="scss">
.module{
  background-color: #212733;
  border-radius: 3px;
  padding-top: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  transition: background-color 500ms ease, opacity 500ms ease;
  position: relative;
  &.playing{
    background-color: #A3CF30;
  }
  &.paused{
    opacity: 0.9;
  }
  .deep-fried-module{
    position: absolute !important;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    position: fixed;
    pointer-events: none;
    backdrop-filter: saturate(5) contrast(5) hue-rotate(30deg) blur(0px); // the deep frying
    background-color: rgba(pink, 0.5);
  }
  .remove-module{
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
