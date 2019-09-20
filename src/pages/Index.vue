<template>
  <Cover>
    <BlinkyText>
      hOmewRecKerzzzzz
    </BlinkyText>
    <p>
      Are you ready to get wrECkeD? 😘
    </p>
    <b-button variant="primary" to="/play">
      yass, i am rAdy to get wrECkeD
    </b-button>
    <b-button variant="danger" to="/lotta-llama">
      yass, i am rAdy to get wrECkeD
      naw, im p amBIvalEnt about getting wrECkeD
    </b-button>
  </Cover>
</template>

<script>
import Cover from '../components/Cover';
import BlinkyText from '../components/BlinkyText';
export default {
  name: 'Index',
  components: {
    Cover,
    BlinkyText
  }
}
</script>
