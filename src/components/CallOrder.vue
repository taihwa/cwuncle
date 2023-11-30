<template>
  <div>

    <b-row class="my-1">
      <b-col sm="1"><label>발송날짜</label></b-col>
      <b-col sm="9"><b-form-input v-model="call.date"></b-form-input></b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="1"><label>플랫폼</label></b-col>
      <b-col sm="9"><b-form-input v-model="call.platform" value="전화"></b-form-input></b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="1"><label>수취인</label></b-col>
      <b-col sm="9"><b-form-input v-model="call.su"></b-form-input></b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="1"><label>주소</label></b-col>
      <b-col sm="1"><b-button @click="getDaumPost()">주소검색</b-button></b-col>
      <b-col sm="1"><b-form-input v-model="call.zipcode" ></b-form-input></b-col>
      <b-col sm="7"><b-form-input v-model="call.address"></b-form-input></b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="1"><label>연락처</label></b-col>
      <b-col sm="9"><b-form-input v-model="call.su_num1"></b-form-input></b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="1"><label>배송메세지</label></b-col>
      <b-col sm="9"><b-form-input v-model="call.message"></b-form-input></b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="1"><label>상품명</label></b-col>
      <b-col sm="9"><b-form-input list="my-list-id" @change="changeEvent(call.product_name)" v-model="call.product_name"></b-form-input></b-col>
      <datalist id="my-list-id">
        <option v-for="product in products">{{product.name}}</option>
      </datalist>
    </b-row>
    <b-row class="my-1">
      <b-col sm="1"><label>수량</label></b-col>
      <b-col sm="9"><b-form-input v-model="call.cnt"></b-form-input></b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="1"><label>상품코드</label></b-col>
      <b-col sm="6">
        <b-form-input list='code-list' v-model="call.product_code"></b-form-input>
        <datalist id="code-list">
          <option v-for="nongga in productData">{{nongga.nongga_name}}</option>
        </datalist>
      </b-col>
      <b-col>
        <b-button variant='success'  @click='setNongga(call.product_code)'>검색</b-button>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="1"><label>판매가</label></b-col>
      <b-col sm="9"><b-form-input v-model="call.sell_price"></b-form-input></b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="1"><label>공급가</label></b-col>
      <b-col sm="9"><b-form-input v-model="call.gong_price"></b-form-input></b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="1"><label>택배비</label></b-col>
      <b-col sm="9"><b-form-input v-model="call.delivery_pay"></b-form-input></b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="10"><b-button block v-on:click="ac_callDataUpload(call)">저장하기</b-button></b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Call",
  data() {
    return {
      call: {
        zipcode:'',
        address:''
      },
      name:'',
      names: [],
      products: []
    };
  },
  created() {
    this.ac_getProductData()
  },
  computed: {
    ...mapGetters([
      'getproductData'
    ]),
    productData () {
      if(this.getproductData) return this.getproductData
    },
    getGongPrice () {
      if(this.call.product_name) {
        for(let v = 0; v < this.getproductData.length; v++) {
          for(let k = 0; k < this.getproductData[v].nongga_product.length; k++) {
            if(this.call.product_name === this.getproductData[v].nongga_product[k].product_name) {
              this.call.gong_price = this.getproductData[v].nongga_product[k].gongprice
            }
          }
        }
      }
      return this.call.gong_price
    }
  },
  methods: {
    ...mapActions(["ac_callDataUpload",'ac_getProductData']),
    getDaumPost () {
      daum.postcode.load( () => {
      new daum.Postcode({
        oncomplete: (data) => {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
            var extraRoadAddr = ''; // 도로명 조합형 주소 변수

            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                extraRoadAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if(data.buildingName !== '' && data.apartment === 'Y'){
                extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if(extraRoadAddr !== ''){
                extraRoadAddr = ' (' + extraRoadAddr + ')';
            }
            // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
            if(fullRoadAddr !== ''){
                fullRoadAddr += extraRoadAddr;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            this.call.zipcode = data.zonecode
            this.call.address = fullRoadAddr
        }
        }).open();
      });
    },
    setNongga (name) {
      for(let i = 0; i < this.getproductData.length; i++) {
        if(this.getproductData[i].nongga_name === this.call.product_code) {
          this.products = this.getproductData[i].nongga_product
        }
      }
    },
    changeEvent (name) {
      console.log(name)
      for(let i = 0; i < this.getproductData.length; i++) {
        if(this.getproductData[i].nongga_name === this.call.product_code) {
          let products = this.getproductData[i].nongga_product
          for( let k = 0; k < this.products.length; k++) {
            if(this.products[k].name === name) {
              this.call.gong_price= this.products[k].gongprice
            }
          }
        }
      }
    }
  },
  components: {

  }
};
</script>