<template>
  <div>
    <input id="calendar" v-model="select_date"> ~ <input id="calendar2" v-model="select_date2">
  </div>
  
</template>

<script>
import Vue from 'vue'

export default {
    data () { 
        return {
            select_date:null,
            select_date2:null
        }
    },
    mounted() {
        $('#calendar').datepicker({
            dateFormat: "yy-mm-dd",
            onSelect: (date) => {
                this.select_date = date
            }
        });
        $('#calendar2').datepicker({
            dateFormat: "yy-mm-dd",
            onSelect: (date) => {
                this.select_date2 = date
            }
        });
    },
    watch: {
        select_date:{
            handler: function(val,oldval) {
                this.sendData(val);
            },
            deep:true
        },
        select_date2:{
            handler: function(val,oldval) {
                this.sendData2(val);
            },
            deep:true
        } 
    },
    methods: {
        sendData(date) {
            this.$emit('send-date',date)
        },
        sendData2(date) {
            this.$emit('send-date2',date)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
