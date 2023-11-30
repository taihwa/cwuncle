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
        { key: 'send_name', label: '보내시는분' },
        { key: 'send_num1', label: '보내시는분전화' },
        { key: 'send_name2', label: '보내시는분 담당자' },
        { key: 'xxx1', label: '' },
        { key: 'xxx2', label: '' },
        { key: 'send_address', label: '보내시는 분 총주소' },
        { key: 'su_name', label: '*받으시는분' },
        { key: 'su_num1', label: '*받으시는분 전화' },
        { key: 'xxx3', label: '' },
        { key: 'xxx4', label: '받으시는 전화번호' },
        { key: 'su_zipcode', label: '받으시는분우편번호' },
        { key: 'su_address', label: '받으시는분 총 주소' },
        { key: 'cnt', label: '수량' },
        { key: 'product_name', label: '품목면' },
        { key: 'xxx5', label: '운임타입' },
        { key: 'xxx6', label: '지불조건' },
        { key: 'xxx7', label: '출고번호' },
        { key: 'message', label: '특기사항' },
        { key: 'xxx8', label: '메모1' },
        { key: 'xxx9', label: '메모2' }
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
              'send_name':this.customers[i].product_code,
              'send_num1':'070-5226-1483',
              'send_name2': '자갈치시장쇼핑몰고객센터',
              'send_address': '부산시 중구 남포동4가, 자갈치시장',
              'su_name':su_name,
              'su_num1':this.customers[i].su_num1,
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
              'xxx8': '',
              'xxx9': ''
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