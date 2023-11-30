<template>
  <div id="app">
    <cw-header></cw-header>
    <router-view></router-view>
    <cw-footer></cw-footer>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    'cw-header':Header,
    'cw-footer':Footer
  }
}
</script>

<style>

</style>
