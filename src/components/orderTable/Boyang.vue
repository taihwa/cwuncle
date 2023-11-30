<template>
  <div>
    <b-table :fields="fields" :items="items" class="list_table" id="bb_list_table">
    </b-table>
  </div>
</template>
<script>
export default {
  name: 'Boyang',
  data () {
    return {
      fields: [
        { key: 'su_name', label: '받는분성명' },
        { key: 'su_num1', label: '받는분전화번호' },
        { key: 'su_address', label: '받는분주소(전체, 분할)' },
        { key: 'product_name', label: '내품명' },
        { key: 'box_cnt', label: '박스수량'},
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
              'box_cnt' : '1'
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