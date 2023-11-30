<template>
  <div>
    <b-container class="bv-example-row bv-example-row-flex-cols">
        <b-row>
            <b-col align-self="center">Copyright BBsoft all right reserved</b-col>
        </b-row>
    </b-container>
  </div>
  
</template>

<script>
export default {
    methods: {
        clearTodo() {
            this.$emit('removeAll');
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
