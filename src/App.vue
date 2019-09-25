<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Turret+Road|VT323&display=swap');
// Variables
$main-font: 'VT323', monospace;
$secondary-font: 'Turret Road', sans-serif;
$bg-color: black;
$main-color: white;
$font-family-sans-serif: $secondary-font;
$headings-font-family: $main-font;
$body-bg: $bg-color;
$body-color: $main-color;

// Toolkit
$shadow-dark: 0px 4px 30px rgba(0, 0, 0, 0.08);
$shadow-light: 0px 1px 20px rgba(0, 0, 0, 0.06);

// Bootstrap Import
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

// Main Font Size
html {
  font-size: 20px !important; // Set size of 1rem
}

</style>
