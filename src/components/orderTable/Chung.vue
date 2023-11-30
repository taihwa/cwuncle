<template>
  <div>
    <b-table :fields="fields" :items="items" class="list_table" id="bb_list_table">
    </b-table>
  </div>
</template>
<script>
export default {
  name: 'Chungyang',
  data () {
    return {
      fields: [
        { key: 'su_name', label: '수취인' },
        { key: 'zipcode', label: '우편번호' },
        { key: 'su_address', label: '주소' },
        { key: 'su_num1', label: '연락처' },
        { key: 'product_name', label: '품목' },
        { key: 'cnt', label: '수량' },
        { key: 'message', label: '메세지' }
      ]
    }
  },
  props: ['customers'],
  computed: {
      items:function() {
          let tae_cus = [];
          for(let i=0; i<this.customers.length; i++) {
            let arr = {
              'su_name':this.customers[i].su,
              'su_num1':this.customers[i].su_num1,
              'su_address':this.customers[i].address,
              'zipcode':this.customers[i].zipcode,
              'product_name':this.customers[i].product_name + "  - " + this.customers[i].cnt + "개",
              'message':this.customers[i].message,
              'cnt': 1
              }
            tae_cus.push(arr);
          }
          return tae_cus
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>