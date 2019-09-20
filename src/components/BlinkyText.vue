<template>
  <h1 class="blinky-text">
    <slot />
  </h1>
</template>

<script>
export default {
  name: 'BlinkyText'
}
</script>

<style lang="scss">
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
