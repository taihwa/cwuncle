<template>
  <div class="hello">
    <b-button @click="ac_getNewOrderNaver()">네이버 신규주문 가져오기</b-button>
    <b-button @click="ac_getNewOrderEsm()">esm 신규주문 가져오기</b-button>
    <b-button @click="ac_getNewOrderCoupang()">쿠팡 신규주문 가져오기</b-button>
    <b-button @click="ac_getNewOrder11st()">11번가 신규주문 가져오기</b-button>
    <b-table :items="getNewOrderData" :busy="getIsbusy" class="mt-3" outlined>
      <div slot="table-busy" class="text-center text-danger my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>{{message}}</strong>
      </div>
    </b-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import io from 'socket.io-client'
export default {
  name: 'HelloWorld',
  data () {
    return {
      isBusy: false,
      message: 'Loading'
    }
  },
  created () {
    this.ac_getNewOrderData();
  },
  mounted () {
    var socket = io('https://bagcw.com');
    socket.on('update', (data) => {
    this.message = data
   });

  },
    computed: {
    ...mapGetters([
      'getNewOrderNaverData',
      'getNewOrderEsmData',
      'getIsbusy',
      'getNewOrderData'
    ]),
    items : function () {
      let toHangul = []
      let data = []
      if(this.getNewOrderNaverData) {
        data = this.getNewOrderNaverData
      }
      if(this.getNewOrderEsmData) {
        console.log(this.getNewOrderEsmData)
        data = this.getNewOrderEsmData
        console.log(data)
      }
      if(data) {
        for(let i = 0; i < data.length; i++) {
          let json = {}
          json['플랫폼'] = data.platform;
          json['상품주문번호'] = data.jumun_number;
          json['상품명'] = data.product_name;
          json['갯수'] = data.cnt;
          json['주문자'] = data.jumunja;
          json['주문자 연락처'] = data.jumun_num;
          json['주문상태'] = data.jumun_state;
          json['상품번호'] = data.product_num;
          json['수취인'] = data.su;
          json['수취인 연락처1'] = data.su_num1;
          json['수취인 연락처2'] = data.su_num2;
          json['우편번호'] = data.zipcode;
          json['주소'] = data.address;
          json['정산받은돈'] = data.jungsan_price;
          json['판매가'] = data.sell_price;
          json['배송비'] = data.delivery_pay;
          json['상품코드'] = data.cw_code;
          toHangul[i] = json
        }
      }
      console.log(toHangul)
      return toHangul
    }
  },
  methods: {
  ...mapActions([
    'ac_getNewOrderNaver',
    'ac_getNewOrderEsm',
    'ac_getNewOrderData',
    'ac_getNewOrderCoupang',
    'ac_getNewOrder11st'
  ]),

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
