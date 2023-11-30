<template>
  <div>
    <b-table :fields="fields" :items="items" class="list_table" id="bb_list_table">
    </b-table>
  </div>
</template>
<script>
export default {
  name: 'Tae',
  data () {
    return {
      fields: [
        { key: 'delivery', label: '택배사' },
        { key: 'songjang', label: '송장번호' },
        { key: 'su_name', label: '수취인명' },
        { key: 'product_name', label: '옵션정보' },
        { key: 'cnt', label: '수량' },
        { key: 'su_num1', label: '수취인연락처1' },
        { key: 'su_num2', label: '수취인연락처2' },
        { key: 'su_address', label: '배송지' },
        { key: 'su_zipcode', label: '우편번호' },
        { key: 'message', label: '배송메세지' }
      ]
    }
  },
  props: ['customers'],
  computed: {
      items:function() {
          let tae_cus = [];
          for(let i=0; i<this.customers.length; i++) {
            let arr = {'delivery':'','songjang':'','su_name':this.customers[i].su,'su_num1':this.customers[i].su_num1,'su_num2':this.customers[i].su_num2,'su_zipcode':this.customers[i].zipcode,'su_address':this.customers[i].address,'product_name':this.customers[i].product_name,'cnt':this.customers[i].cnt,'message':this.customers[i].message}
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