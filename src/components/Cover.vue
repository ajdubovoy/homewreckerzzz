<template>
  <div class="cover text-center">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Cover'
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
</style>
