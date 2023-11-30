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
        { key: 'jumunja', label: '주문자명' },
        { key: 'jumun_num', label: '주문자 이동통신' },
        { key: 'su_name', label: '수취인명' },
        { key: 'zipcode', label: '수취인 우편번호' },
        { key: 'su_address', label: '수취인 주소' },
        { key: 'su_num1', label: '수취인 이동통신' },
        { key: 'product_name', label: '상품명' },
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
              'jumunja':this.customers[i].jumunja,
              'jumun_num':this.customers[i].jumun_num,
              'su_name':this.customers[i].su,
              'su_num1':this.customers[i].su_num1,
              'su_address':this.customers[i].address,
              'zipcode':this.customers[i].zipcode,
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