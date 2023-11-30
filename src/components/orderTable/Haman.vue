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
        { key: 'su_name', label: '공란' },
        { key: 'su_address', label: '공란' },
        { key: 'su_address', label: '공란1' },
        { key: 'su_num1', label: '공란' },
        { key: 'su_num2', label: '공란' },
        { key: 'delivery_num', label: '공란' },
        { key: 'delevery_pee', label: '공란' },
        { key: 'delivery_type', label: '공란' },
        { key: 'product_name', label: '공란' },
        { key: 'message', label: '공란' }
      ]
    }
  },
  props: ['customers'],
  computed: {
      items:function() {
          let tae_cus = [];
          for(let i=0; i<this.customers.length; i++) {
            let arr = {'delivery_num':'1','delevery_pee':'3000','delivery_type':'선불','su_name':this.customers[i].su,'su_num1':this.customers[i].su_num1,'su_num2':this.customers[i].su_num2,'su_zipcode':this.customers[i].zipcode,'su_address':this.customers[i].address,'product_name':this.customers[i].product_name + "  - " + this.customers[i].cnt + "개",'cnt':this.customers[i].cnt,'message':this.customers[i].message}
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