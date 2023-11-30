<template>
  <div>
    <b-table :fields="fields" :items="items" class="list_table" id="bb_list_table">
    </b-table>
  </div>
</template>
<script>
export default {
  name: 'Passion',
  data () {
    return {
      fields: [
        { key: 'xxx1', label: '주문번호' },
        { key: 'send_name', label: '보내는사람(지정)' },
        { key: 'send_num1', label: '전화번호1(지정)' },
        { key: 'send_num2', label: '전화번호2(지정)' },
        { key: 'xxx2', label: '우편번호(지정)' },
        { key: 'xxx3', label: '주소(지정)' },
        { key: 'su_name', label: '받는사람' },
        { key: 'su_num1', label: '전화번호1' },
        { key: 'su_num2', label: '전화번호2' },
        { key: 'su_zipcode', label: '우편번호' },
        { key: 'su_address', label: '주소' },
        { key: 'product_name', label: '상품명1' },
        { key: 'xxx4', label: '상품상세1' },
        { key: 'cnt', label: '수량(A타입)' },
        { key: 'message', label: '배송메시지' },
        { key: 'xxx5', label: '운임구분' },
        { key: 'xxx6', label: '운임' },
        { key: 'xxx7', label: '운송장번호' }
      ]
    }
  },
  props: ['customers'],
  computed: {
      items:function() {
          let tae_cus = [];
          for(let i=0; i<this.customers.length; i++) {
            let su_name = (this.customers[i].su === this.customers[i].jumunja) ? this.customers[i].su : `${this.customers[i].su}(${this.customers[i].jumunja})`
            let su_num2 = (this.customers[i].su_num2 === "0") ? this.customers[i].su_num1 : this.customers[i].su_num2
            let arr = {
              'send_name':'솔이네홍합',
              'send_num1':'0507-1334-0144',
              'send_num2':'010-3064-0144',
              'su_name':su_name,
              'su_num1':this.customers[i].su_num1,
              'su_num2':su_num2,
              'su_zipcode':'',
              'su_address':this.customers[i].address,
              'product_name':this.customers[i].product_name,
              'cnt':1,
              'message':this.customers[i].message,
              'xxx1': '',
              'xxx2': '',
              'xxx3': '',
              'xxx4': '',
              'xxx5': '',
              'xxx6': '',
              'xxx7': ''
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