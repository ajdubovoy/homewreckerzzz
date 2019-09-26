<template>
  <Cover>
    <BlinkyText>
      hOmewRecKerzzzzz
    </BlinkyText>
    <p>
      Are you ready to get wrECkeD? 😘
    </p>
    <b-button variant="primary" @click="handlePlay">
      yass, i am rAdy to get wrECkeD
    </b-button>
    <b-button variant="danger" to="/lotta-llama">
      naw, im p amBIvalEnt about getting wrECkeD
    </b-button>
  </Cover>
</template>

<script>
import { mapActions } from 'vuex';
import Cover from '../components/Cover';
import BlinkyText from '../components/BlinkyText';
export default {
  name: 'Index',
  components: {
    Cover,
    BlinkyText
  },
  methods: {
    handlePlay() {
      this.confirmConsent(); // Little hack for iOS WebAudio
      this.$router.push('/play');
    },
    ...mapActions([
      'confirmConsent'
    ])
  }
}
</script>
