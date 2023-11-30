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
        { key: 'xxx1', label: '고객주문번호' },
        { key: 'xxx2', label: '사용안함' },
        { key: 'send_name', label: '보내는분성명' },
        { key: 'send_num1', label: '보내는분전화번호' },
        { key: 'send_num2', label: '보내는분기타연락처' },
        { key: 'su_name', label: '받는분성명' },
        { key: 'su_num1', label: '받는분전화번호' },
        { key: 'su_num2', label: '받는분기타연락처' },
        { key: 'su_zipcode', label: '받는분우편번호' },
        { key: 'su_address', label: '받는분주소' },
        { key: 'message', label: '배송메세지1' },
        { key: 'xxx3', label: '사용안함' },
        { key: 'xxx4', label: '사용안함' },
        { key: 'xxx5', label: '사용안함' },
        { key: 'product_name', label: '품목명' },
        { key: 'xxx6', label: '사용안함' },
        { key: 'xxx7', label: '사용안함' },
        { key: 'cnt', label: '박스수량' },
        { key: 'xxx8', label: '배송메세지2' }
      ]
    }
  },
  props: ['customers'],
  computed: {
      items:function() {
          let tae_cus = [];
          for(let i=0; i<this.customers.length; i++) {
            let arr = {
              'send_name':'마녀의농장',
              'send_num1':'010-3191-3531',
              'send_num2':'',
              'send_zipcode':'',
              'su_name':this.customers[i].su,
              'su_num1':this.customers[i].su_num1,
              'su_num2':this.customers[i].su_num2,
              'su_zipcode':this.customers[i].zipcode,
              'su_address':this.customers[i].address,
              'product_name':this.customers[i].product_name + ' - ' + this.customers[i].cnt + '개',
              'cnt':1,
              'message':this.customers[i].message,
              'xxx1': '',
              'xxx2': '',
              'xxx3': '',
              'xxx4': '',
              'xxx5': '',
              'xxx6': '',
              'xxx7': '',
              'xxx8': ''
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