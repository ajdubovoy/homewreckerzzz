<template lang="pug">
.module(:class="playing ? 'playing' : 'paused'")
  .deep-fried-module(v-if="deepFried")
  b-alert(show) {{ socketMessage }}
  slot
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
      .row
        .col-6 
          b-form-group
            b-form-group(label="Instrument")
              b-form-radio(v-model="instrument" name="instrument" v-for="i in instrumentOptions" :value="i.value") {{ i.text }}
        .col-6
          b-form-group(v-if="instrument < 2")
            b-form-checkbox(v-model="sustain") Sustain Mode
      .row
        b-form-group.col-6
          label(for="amplitude") Amplitude: {{ amplitudePercentage }}%
          b-form-input(id="amplitude" v-model="amplitude" type="range" min="0" max="128")
        b-form-group.col-6(v-if="instrument < 2 || instrument === 3")
          label(for="frequency") Frequency: {{ pitchName }}
          b-form-input(id="frequency" v-model="frequency" type="range" min="0" max="128")
        b-form-group.col-6(v-if="instrument === 3")
          label(for="density") Density: {{ density }}
          b-form-input(id="density" v-model="density" type="range" min="1" max="15")
        b-form-group.col-6(v-if="instrument === 1")
          label(for="cluster-type") Cluster Type
          b-form-select(name="cluster-type" v-model="clusterType" :options="['major', 'minor', 'chromatic', 'random']")
        b-form-group.col-6(v-if="instrument < 2 || instrument === 3")
          label(for="wave-type") Wave Type
          b-form-select(name="wave-type" v-model="waveType" :options="['sine', 'square', 'sawtooth', 'triangle']")
        b-form-group.col-6(v-if="instrument === 2")
          label(for="file-name") File
          b-form-select(name="file-name" v-model="fileName" :options="files")
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
import axiosClient from '../helpers/axios_client';
import throttle from 'lodash.throttle';
import midiToName from '../helpers/midi_to_name';
import quizzes from '../data/quizzes';
import instruments from '../data/instruments';

export default {
  name: 'Module',
  data() {
    return {
      socketMessage: "Module added!",
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
      deepFried: false,
      density: 3,
      fileName: ""
    };
  },
  props: {
    midi: Array,
    instance: Number,
    files: Array
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
    audience() {
      return {
        roomSection: this.roomSection,
        seatingHeight: this.seatingHeight,
        randomQuestion: this.randomQuestion
      };
    },
    instrumentRequest() {
      return {
        instrument: this.instrument,
        audience: this.audience,
        controls: {
          sustain: this.sustain,
          amplitude: this.amplitude,
          frequency: this.frequency,
          waveType: this.waveType,
          clusterType: this.clusterType,
          density: this.density,
          file: this.fileName
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
    emitSocket(message, request) {
      this.socketMessage = `Sending ${message} request...`;
      axiosClient.post('sockets', {
        message,
        request
        })
        .then(() => {
          this.socketMessage = `${message} request sent`;
        })
        .catch(() => {
          this.socketMessage = `OOPS BLOOPS, something went wrong with the ${message} request`;
        });
    },
    handlePlay() {
      this.emitSocket('play', this.instrumentRequest);
      this.playing = true;
    },
    handleUpdate: throttle(function() {
      if (this.playing) {
        this.emitSocket('update', this.instrumentRequest);
      }
    }, 300),
    handleKill() {
      this.emitSocket('kill', this.instrumentRequest);
      this.playing = false;
    },
    handleQuiz() {
      const quiz = quizzes[this.quiz - 1];
      if (quiz) {
        this.emitSocket('quizAsk', {...quiz, audience: this.audience});
      } else {
        this.socketMessage = 'why dont U seleCT a quiZ!?!?';
      }
    },
    handleDeepFry() {
      this.emitSocket('deepFry', this.audience);
      this.deepFried = true;
    },
    unDeepFry() {
      this.emitSocket('unDeepFry', this.audience);
      this.deepFried = false;
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
  watch: {
    midi(newMIDI) {
      this.amplitude = newMIDI[this.instance];
      this.frequency = newMIDI[this.instance + 8];
    },
    amplitude() {
      this.handleUpdate();
    },
    frequency() {
      this.handleUpdate();
    },
    clusterType() {
      this.handleUpdate();
    },
    waveType() {
      this.handleUpdate();
    },
    density() {
      this.handleUpdate();
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
  .form-group {
    margin-bottom: 0.5rem;
  }
}
</style>
