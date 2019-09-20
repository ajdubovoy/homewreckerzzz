<template>
  <div class="cover text-center llama">
    <h1 class="blinky-text s-text-dark">
      Are you ready to get wrECkeD now?? 😘
    </h1>
    <b-button variant="primary" to="/">
      yass, i am NOW ⏰ rAdy to get wrECkeD
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
.llama{
  background-image: url('~@/assets/images/llama.gif');
}
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
