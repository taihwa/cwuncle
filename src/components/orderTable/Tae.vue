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
        { key: 'send_name', label: '보내는사람' },
        { key: 'send_num1', label: '전화번호' },
        { key: 'send_num2', label: '핸드폰번호' },
        { key: 'send_zipcode', label: '우편번호' },
        { key: 'send_address', label: '보내는주소' },
        { key: 'su_name', label: '받는분' },
        { key: 'su_num1', label: '전화번호' },
        { key: 'su_num2', label: '전화번호2' },
        { key: 'send_zipcode1', label: '우편번호' },
        { key: 'su_address', label: '수취인주소' },
        { key: 'product_name', label: '상품명' },
        { key: 'cnt', label: '수량' },
        { key: 'message', label: '배송메세지' },
        { key: 'site', label: '사이트' },
        { key: 'num', label: '주문순서' }
      ]
    }
  },
  props: ['customers'],
  computed: {
      items:function() {
          let tae_cus = [];
          for(let i=0; i<this.customers.length; i++) {
            let arr = {'send_name':'창원아재들','send_num1':'0504-1334-0144','send_num2':'0504-1334-0144','send_zipcode':'','send_address':'경남 통영시 동호안길 86 (동원비치맨션) 상가A동 101호','su_name':this.customers[i].su + '(' + this.customers[i].jumunja + ')','su_num1':this.customers[i].su_num1,'su_num2':this.customers[i].su_num2,'su_zipcode':this.customers[i].zipcode,'su_address':this.customers[i].address,'product_name':this.customers[i].product_name,'cnt':this.customers[i].cnt,'message':this.customers[i].message,'site':''}
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