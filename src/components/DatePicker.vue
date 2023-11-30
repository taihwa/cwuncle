<template>
  <div>
    <input id="calendar" v-model="select_date">
  </div>
  
</template>

<script>
import Vue from 'vue'

export default {
    data () { 
        return {
            select_date:null
        }
    },
    mounted() {
        $('#calendar').datepicker({
            dateFormat: "yy-mm-dd",
            onSelect: (date) => {
                this.select_date = date
            }
        });
    },
    watch: {
        select_date:{
            handler: function(val,oldval) {
                this.sendData(val);
            },
            deep:true
        } 
    },
    methods: {
        sendData(date) {
            this.$emit('send-date',date)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
