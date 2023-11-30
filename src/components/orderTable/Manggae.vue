<template>
  <div>
    <b-table :fields="fields" :items="items" class="list_table" id="bb_list_table">
    </b-table>
  </div>
</template> 
<script>
export default {
  name: 'Manggae',
  data () { 
    return {													
      fields: [
        { key: 'send_name', label: '공급지명' },
        { key: 'jumunja', label: '주문자명' },
        { key: 'jumunja_num', label: '주문자 이동통신' },
        { key: 'product_name', label: '상품명' },
        { key: 'su_name', label: '수취인명' },
        { key: 'su_num1', label: '수취인 전화번호' },
        { key: 'su_address', label: '수취인 주소' },
        { key: 'su_zipcode', label: '수취인 우편번호' },
        { key: 'message', label: '배송메세지1' },
      ]
    }
  },
  props: ['customers'],
  computed: {
      items:function() {
          let tae_cus = [];
          for(let i=0; i<this.customers.length; i++) {
            let arr = {
              'send_name':'의령부자망개떡',
              'jumunja':this.customers[i].jumunja,
              'jumunja_num':this.customers[i].jumun_num,
              'su_name':this.customers[i].su,
              'su_num1':this.customers[i].su_num1,
              'su_num2':this.customers[i].su_num2,
              'su_zipcode':this.customers[i].zipcode,
              'su_address':this.customers[i].address,
              'product_name':this.customers[i].product_name + "  - " + this.customers[i].cnt + "개",
              'message':this.customers[i].message,
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