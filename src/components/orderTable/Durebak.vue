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
        { key: 'su_name', label: '수취인명' },
        { key: 'empty', label: '' },
        { key: 'su_address', label: '수하인주소' },
        { key: 'su_num2', label: '수하인전화번호' },
        { key: 'su_num1', label: '수하인핸드폰번호' },
        { key: 'box_cnt', label: '박스수량' },
        { key: 'delivery_pay', label: '택배운임' },
        { key: 'pay_distri', label: '운임구분' },
        { key: 'product_name', label: '품목명' },
        { key: 'empty', label: '' },
        { key: 'message', label: '배송메세지' }
      ]
    }
  },
  props: ['customers'],
  computed: {
      items:function() {
          let tae_cus = [];
          for(let i=0; i<this.customers.length; i++) {
            let arr = {
              'empty':'',
              'su_name':this.customers[i].su,
              'su_num1':this.customers[i].su_num1,
              'su_num2':this.customers[i].su_num2,
              'su_address':this.customers[i].address,
              'box_cnt':1,
              'delivery_pay':3000,
              'pay_distri':'선불',
              'product_name':this.customers[i].product_name + "  - " + this.customers[i].cnt + "개",
              'message':this.customers[i].message
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