<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="info">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand router-link to="/main">창원아재들</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item router-link to="/order">발주</b-nav-item>
          <b-nav-item router-link to="/calculate">정산</b-nav-item>
          <b-nav-item router-link to="/sales">매출</b-nav-item>
          <b-nav-item router-link to="/sns">SNS관리</b-nav-item>
          <b-nav-item router-link to="/kakao">알림톡</b-nav-item>
          <b-nav-item router-link to="/call">전화주문</b-nav-item>
          <b-nav-item router-link to="/search">검색</b-nav-item>
          <b-nav-item router-link to="/delivery">송장입력</b-nav-item>
          <b-nav-item router-link to="/product">상품관리</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  </div>

</template>

<script>
import Vue from 'vue'
export default {
  methods: {
    sendCall () {
      var eventBus = new Vue()
      eventBus.$emit('callJumun', true)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
