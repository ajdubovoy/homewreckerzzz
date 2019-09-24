<template>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Play',
  mounted() {
    if (!this.initialized) {
      this.$router.push('/quiz');
    }
  },
  computed: {
    ...mapGetters([
      'initialized'
    ])
  }
}
</script>

<style lang="scss">
</style>
