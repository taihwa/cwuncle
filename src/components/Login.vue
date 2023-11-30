<template>
  <div>
    <b-row class="justify-content-md-center">
      <b-col cols="6">
        <div v-if="errors && errors.length">
          <div v-for="error of errors">
            <b-alert show>{{error.message}}</b-alert>
          </div>
        </div>
        <b-form @submit="onSubmit">
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Username">
            <b-form-input id="username" v-model.trim="login.id"></b-form-input>
          </b-form-group>
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Password">
            <b-form-input type="password" id="password" v-model.trim="login.password"></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Login</b-button>
        </b-form>
      </b-col>
    </b-row>
    <div v-if="bar">
      <b-progress :value="counter" :max="max" show-progress animated></b-progress>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Login',
  data () {
    return {
      login: {},
      errors: [],
      counter: 0,
      max : 100,
      bar : false
    }
  },
  methods: {
    onSubmit (evt) {
      this.loginBar()
      evt.preventDefault() 
      axios.post(`https://bagcw.com/api/auth/login/`, this.login)
      .then(response => {
        this.bar = false
        alert("로그인 성공")
        localStorage.setItem('jwtToken', response.data.token)
        this.$router.push({
          name: 'HelloWorld'
        })
      })
      .catch(e => {
        console.log(e)
        this.errors.push(e)
      })
    },
    loginBar () {
      this.bar = true
      setInterval(() => {
        this.counter += 1
      },1000)

    },
    register () {
      this.$router.push({
        name: 'Register'
      })
    }
  }
}
</script>