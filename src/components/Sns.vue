<template>
  <div>
    <button v-on:click="loginWithInsta()">인스타그램 로그인</button>
    <button v-on:click="getInstagram()">리스트 가져오기</button>
    <button @click="getGoogleData()">구글 데이터 가져오기</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
export default {
  name: 'Sns',
  data () {
    return {

    }
  },
  created() {
  },
  computed: {
    ...mapGetters([
    ])
  },
  methods: {
    ...mapActions([
    ]),
    loginWithInsta () {
      alert(111)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

