<template lang="pug">
.puppeteer
  Cover(v-if="!puppeteer")
    BlinkyText
      | Please authenticate yourself...or elseeeee (if ur not grEG get outtttt)
    b-form(@submit="handleSubmit(password)")
      b-form-group
        b-form-input(v-model='password' type='password') 
      b-button(type="submit" variant="primary") Unleash the Hounds
  b-container#puppeteer-dash(v-else fluid="true")
    b-row
      b-col.text-center
        h1
          | wilkOMmEn to ur excLUsivE dashBoARD, oh puppeTeeR GREG
        h2
          | I made it 'speciALLY für U with lovE and cArE
    b-row.mb-5
      b-col(v-for="module in modules" lg=6 xl=3 :key="module")
        Module
          b-button.remove-module(variant="danger" @click="removeModule(module)") ➖
      b-col(lg=6 xl=3)
        b-button.w-100.h-100.add-module(variant="success" @click="addModule") ➕ Add Module
  b-container#additional-options
    h3 File Upload
    b-form(@submit.prevent="handleFileSubmit(userFile)" enctype="multipart/form-data")
      b-form-group
        b-form-file(accept="audio" name="userFile" v-model="userFile" :state="Boolean(userFile)" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here...")
        b-button(type="submit" variant="primary") Send it to the alIEnS
</template>

<script>
import { mapState, mapActions } from 'vuex';
import axios from 'axios';
import Cover from '../components/Cover';
import BlinkyText from '../components/BlinkyText';
import Module from '../components/Module';

export default {
  name: 'Puppeteer',
  mounted() {
    this.connectMIDI();
    this.addModule();
  },
  data() {
    return {
      password: '',
      modules: [],
      userFile: null,
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
        // TODO
      }
    },
    onMIDIFailure() {
      this.socketMessage = "Could not access your MIDI devices urgh";
    },
    addModule() {
      this.modules.push(Math.random().toString(36).substr(2, 9)) // Generate random key
    },
    removeModule(module) {
      this.modules = this.modules.filter(function(m) {
        return module !== m;
      });

      if (this.modules.length < 1) {
        this.addModule();
      }
    },
    handleSubmit(password) {
      this.makePuppeteer(password);
      this.password = '';
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
    ...mapActions([
      'makePuppeteer'
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
    BlinkyText,
    Module
  }
}
</script>

<style lang="scss">
.add-module{
  min-height: 25rem;
}
</style>
