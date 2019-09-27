<template lang="pug">
#canvas-container
</template>

<script>
import p5 from 'p5';
import main from '../processing/main.js';

export default {
  data() {
    return {
      sketch: null
    }
  },
  mounted() {
    this.sketch = new p5(main);
  }
}
</script> 

<style lang="scss">
#canvas-container {
  height: 100vh;
  width: 100%;
}

</style>