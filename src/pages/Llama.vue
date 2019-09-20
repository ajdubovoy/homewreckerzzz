<template>
  <Cover class="llama">
    <BlinkyText>
      Are you ready to get wrECkeD now?? 😘
    </BlinkyText>
    <b-button variant="primary" to="/">
      yass, i am NOW ⏰ rAdy to get wrECkeD
    </b-button>
  </Cover>
</template>

<script>
import Cover from '../components/Cover';
import BlinkyText from '../components/BlinkyText';

export default {
  name: 'Llama',
  components: {
    Cover,
    BlinkyText
  }
}
</script>

<style lang="scss">
.llama{
  background-image: url('~@/assets/images/llama.gif');
}
</style>
