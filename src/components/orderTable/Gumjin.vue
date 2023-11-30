<template>
  <div>
    <b-table :fields="fields" :items="items" class="list_table" id="bb_list_table">
    </b-table>
  </div>
</template> 
<script>
export default {
  name: 'Gumjin',
  data () { 
    return {													
      fields: [
        { key: 'su_name', label: '받는분' },
        { key: 'su_num1', label: '연락처' },
        { key: 'su_num2', label: '받는분기타연락처' },
        { key: 'su_address', label: '주소' },
        { key: 'send_name', label: '보내는분' },
        { key: 'send_num1', label: '보내는분전화분호' },
        { key: 'send_address', label: '보내는분주소(전체, 분할)' },
        { key: 'product_name', label: '품목' },
        { key: 'cnt', label: '수량' },
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
              'su_name':this.customers[i].su,
              'su_num1':this.customers[i].su_num1,
              'su_num2':this.customers[i].su_num2,
              'su_address':this.customers[i].address,
              'send_name':'금진수산(창원아재들)',
              'send_address':'경상남도 창원시 마산합포구 진전면 회진로 1503',
              'send_num1':'010-3064-0144',
              'product_name':this.customers[i].product_name + "  - " + this.customers[i].cnt + "개",
              'message':this.customers[i].message,
              'cnt':1
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