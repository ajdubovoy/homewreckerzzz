<template>
  <div class="cover text-center">
    <h1 class="blinky-text">
      hOmewRecKerzzzzz
    </h1>
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
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style lang="scss">
// https://every-layout.dev/layouts/cover/
.cover {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1.5rem;

  & > *{
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  & > :first-child:not(h1){
    margin-top: 0;
  }

  & > :last-child:not(h1){
    margin-bottom: 0;
  }

  & > h1{
    margin-top: auto;
    margin-bottom: auto;
  }
}

// Blinky text
@-webkit-keyframes blinkText{
  0%{
    color: white;
  }
  20%{
    color: green;
  }
  40%{
    color: blue;
  }
  60%{
    color: red;
  }
  80%{
    color: yellow;
  }
  100%{
    color: white;
  }
}

.blinky-text{
  animation: blinkText 5000ms infinite alternate;
}
</style>
