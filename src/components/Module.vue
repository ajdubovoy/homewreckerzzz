<template lang="pug">
.module(:class="playing ? 'playing' : 'paused'")
  .deep-fried-module(v-if="deepFried")
  b-button.remove-module(variant="danger" @click="handleRemove") ➖
  #audience(v-if="!initialized")
    b-form-group
      label(for="room-section") Room Section
      b-form-select(name="room-section" v-model="roomSection" :options="{0: 'All', 1: 'Part 1', 2: 'Part 2', 3: 'Part 3', 4: 'Part 4'}")
    b-form-group
      label(for="random-question") Random Question
      b-form-select(name="random-question" v-model="randomQuestion" :options="{0: 'All', 1: 'Chuck Norris', 2: 'Llama', 3: 'Pineapple'}")
    b-form-group
      label(for="team") Team
      b-form-select(name="team" v-model="team" :options="{0: 'All', 1: 'Piano', 2: 'Sax'}")
    b-button(@click="handleInitialize" variant="primary") Set Audience
  b-tabs(v-else)
    p.small.text-center 🏠: {{ roomSection }}; 🦙: {{ randomQuestion }}; {{ teamEmoji }}&nbsp;
      span.small(v-if="timeRemaining()") ❓⏰: {{ timeRemaining() }}
      span.small 🚦: {{ socketMessage }}
    b-tab(title="🎹")
      .row
        .col-6
          .row
            .col-12.play-buttons
              b-button-group
                b-button(@click="handlePlay" variant="primary") ▶️
                b-button(@click="handleKill" variant="danger") ⏹
            .col-12
              b-form-group
                b-form-radio(v-model="instrument" :name="`instrument-${instance}`" v-for="i in instrumentOptions" :key="i.value" :value="i.value") {{ i.text }}
        b-form-group.col-3.sliders
          label(for="amplitude") 🔊&nbsp;{{ amplitudePercentage }}%
          b-form-input(id="amplitude" v-model="amplitude" type="range" class="vertical" min="0" max="128")
        b-form-group.col-3(v-if="instrument < 2 || instrument === 3")
          label(for="frequency") ♪&nbsp;{{ pitchName }}
          b-form-input(id="frequency" v-model.number="frequency" type="range" class="vertical" :min="minFreq" :max="maxFreq")
          p(:style="{ transform: 'translateY(50%)' }") {{ Math.floor(frequency) }}
      .row
        b-form-group.col-4(v-if="instrument === 3")
          label(for="density") Density:&nbsp;{{ density }}
          b-form-input(id="density" v-model="density" type="range" min="1" max="15")
        b-form-group.col-4(v-if="instrument === 1")
          label(for="cluster-type") Cluster Type
          b-form-select(name="cluster-type" v-model="clusterType" :options="['major', 'minor', 'chromatic', 'random', 'golden', 'euler', 'pythagoras']")
        b-form-group.col-4(v-if="instrument < 2 || instrument === 3")
          label(for="wave-type") Wave Type
          b-form-select(name="wave-type" v-model="waveType" :options="['sine', 'square', 'sawtooth', 'triangle']")
        b-form-group.col-4(v-if="instrument === 2")
          label(for="file-name") File
          b-form-select(name="file-name" v-model="fileName" :options="files")
        b-form-group.col-3(v-if="instrument < 2")
          b-form-checkbox(v-model="sustain") Sustain
    b-tab(title="❓")
      b-form-group
        b-form-select(v-model="quiz" :options="quizOptions()")
      p(v-if="quizInstance") {{ quizInstance.question }}
      p(v-if="quizInstance") {{ quizInstance.answers.join(", ") }}
      b-button(type="submit" variant="primary" :disabled="quiz === 0 || quizActive" @click="handleQuiz") Start Jeopardy Time
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
import midiToFreq from '../helpers/midi_to_freq';
import freqToMidi from '../helpers/freq_to_midi';

export default {
  name: 'Module',
  data() {
    return {
      socketMessage: "Module added!",
      sustain: true,
      amplitude: 100,
      frequency: midiToFreq(72),
      minFreq: midiToFreq(40),
      maxFreq: midiToFreq(100),
      quiz: 0,
      instrument: 0,
      roomSection: 0,
      randomQuestion: 0,
      team: 0,
      waveType: 'sine',
      clusterType: 'major',
      playing: false,
      deepFried: false,
      density: 3,
      fileName: "",
      initialized: false,
      now: new Date(),
      interval: null,
      quizTime: new Date(),
      quizActive: false
    };
  },
  props: {
    midi: Array,
    instance: Number,
    files: Array,
    removeModule: Function,
    id: String
  },
  mounted() {
    this.interval = setInterval(() => {
      this.now = new Date();
      this.timeRemaining();
    }, 500);
  },
  destroyed() {
    clearInterval(this.interval);
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
        roomSection: parseInt(this.roomSection),
        randomQuestion: parseInt(this.randomQuestion),
        team: parseInt(this.team)
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
      const midi = freqToMidi(this.frequency);
      return midiToName(midi);
    },
    amplitudePercentage() {
      return Math.round(this.amplitude / 128 * 100);
    },
    instrumentName() {
      return instruments[this.instrument];
    },
    quizInstance() {
      return quizzes[this.quiz - 1];
    },
    teamEmoji() {
      if (this.team == 1) { return '🎹' }
      if (this.team == 2) { return '🎷' }
      return ''
    },
    ...mapState([
      'puppeteer'
    ]),
  },
  methods: {
    handleInitialize() {
      this.initialized = true;
    },
    handleRemove() {
      this.handleKill();
      this.removeModule();
    },
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
        this.quizTime = new Date();
        this.quizActive = true;
      } else {
        this.socketMessage = 'why dont U seleCT a quiZ!?!?';
      }
    },
    handleDeepFry() {
      this.emitSocket('deepFry', { audience: this.audience });
      this.deepFried = true;
    },
    unDeepFry() {
      this.emitSocket('unDeepFry', { audience: this.audience });
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
    },
    timeRemaining() {
      if (!this.quizActive || !this.quiz) {
        return 0;
      }

      const quiz = quizzes[this.quiz - 1];

      const duration = quiz.duration;
      const time = this.quizTime;

      if (!duration || !time) {
        return 0;
      }

      const difference = duration - (this.now - time);
      if (difference <= 0) {
        this.quizActive = false;
        return 0;
      }
      return Math.round(difference / 1000);
    },
  },
  watch: {
    midi(newMIDI) {
      this.amplitude = newMIDI[this.instance];

      // Calculate frequency on exponential scale based on max and min
      const frequencyInput = newMIDI[this.instance + 8];
      const ratio = Math.log2(this.maxFreq / this.minFreq) / 128;
      const exp = frequencyInput * ratio;
      this.frequency = Math.pow(2, exp) * this.minFreq;
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
  margin-bottom: 1rem;
  background-color: #212733;
  border-radius: 3px;
  .nav-tabs {
    margin-left: 3rem;
  }
  #audience {
    padding-top: 2.5rem;
  }
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
  transition: background-color 500ms ease, opacity 500ms ease;
  position: relative;
  font-size: 0.8rem;
  select {
    font-size: 0.8rem;
    height: calc(1.2em + 0.75rem + 2px);
    padding-top: 0.25em;
  }
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
  p.small{
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  input.vertical {
    transform: rotateZ(270deg);
    margin-top: 65%;
    margin-bottom: 65%;
    margin-left: -50%;
    margin-right: -50%;
  }
  div[role=group] {
    height: 100%;
  }
  .custom-range {
    width: auto;
  }
  .play-buttons {
    margin-bottom: 0.5rem;
    label {
      display: block;
    }
  }
}
</style>
