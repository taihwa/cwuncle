<template>
  <div class="order">
    <h1>송자입력 및 알림톡</h1>
    <DatePicker v-on:send-date="getDate"></DatePicker>
    <b-button variant="success" v-on:click="ac_getOrderData(order_day)">검색</b-button>
    <b-form-select v-model="selected" :options="options" class="mb-3" />
    <b-button variant="success" v-on:click="ac_songjangUpdateData('songjang')">송장저장</b-button>
    <b-button variant="success" v-on:click="saveToExcel()">엑셀다운</b-button>
    <b-button variant="success" v-on:click="arrayTest()">테스트</b-button>
    <b-button variant="success" v-on:click="sendKakao(listLen,0)">알림톡 발송</b-button>
    <b-button variant="success" v-on:click="sendTemplate()">템플릿조회</b-button>
    <b-button variant="success" v-on:click="reportTemplate()">리포트조회</b-button>
    <p>
      <b-form-input id="inputFormatter" v-model="sau" type="text" placeholder="발송지연사유" aria-describedby="inputFormatterHelp" :formatter="format"></b-form-input>
      <b-form-text id="inputFormatterHelp">
        발송지연 사유를 적어주세요
      </b-form-text>
    </p>

    <b-table :fields="fields" :items="getOrderData" class="list_table" id="bb_list_table">
      <template slot="chk" slot-scope="data">
        <input type="checkbox" />
      </template>
      <template slot="delivery_company" slot-scope="data">
        <select :value="data.item.delivery_company">
          <option value="null">택배사선택</option>
          <option value="CJ대한통운">CJ대한통운</option>
          <option value="드림택배">드림택배</option>
          <option value="롯데택배">롯데택배</option>
          <option value="로젠택배">로젠택배</option>
          <option value="한진택배">한진택배</option>
          <option value="우체국택배">우체국택배</option>
        </select>
      </template>
      <template slot="delivery_num" slot-scope="data">
        <input type="text" :value= "data.item.delivery_num" placeholder="송장번호">
      </template>
    </b-table>
  </div>

</template>

<script>
import DatePicker from './DatePicker.vue'
import BButils from './service/bb_utils.js'
import TableToArray from './service/tableToArray.js'
import xlsx from 'xlsx'
import fileSaver from 'file-saver'
import Vue from 'vue'
import Axios from 'axios'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
export default {
  name: 'Kakao',
  data () {
    return {
      selected:null,
      options:[
        { value: null, text: '양식선택' },
        { value: 'def', text: '전체보기' },
        { value: 'Naver', text: '네이버' },
        { value: 'Auction', text: '옥션' },
        { value: 'Coupang', text: '쿠팡' },
        { value: '11st', text: '11번가'},
        { value: 'Kshop', text: 'K쇼핑'}
      ],
      fields: [
        { key: 'chk', label: '' },
        { key: 'delivery_company', label: '택배사',sortable: true },
        { key: 'delivery_num', label: '송장번호' },
        { key: 'platform', label: '플랫폼',sortable: true },
        { key: 'date', label: '날짜',sortable: true },
        { key: 'su', label: '수취인',sortable: true },
        { key: 'su_num1', label: '연락처' },
        { key: 'product_name', label: '상품명',sortable: true },
        { key: 'cnt', label: '수량',sortable: true },
        { key: 'product_code', label: '상품코드',sortable: true },
        { key: 'num', label: '줄번호' },
        { key: 'cancle', label: '취소/환불' }
      ],
      items: [],
      orderData:null,
      order_day:null,
      jumunData : [],
      uniqProduct_code: [],
      selected_code: null,
      listArray: [],
      listLen:null
    }
  },
  created() {

  },

  mounted() {

  },
    computed: {
    ...mapGetters([
        'getOrderData',
        'getUniqCode'
    ])
  },
  watch: {
    selected: function(val) {

    }
  },
  methods: {
    ...mapActions([
      'ac_productDataUpload',
      'ac_getOrderData',
      'ac_songjangUpdateData'
    ]),
    getSheet() {
     let k = 0;
      let bbutils = new BButils();
      var abc = bbutils.getJumun(this.orderData)
      var getJumunData = abc.jumunData
      this.items = [];
      for(var i = 0; i < getJumunData.length; i++) {
        this.jumunData[k] = [];
        var copyContent = [];
        if(getJumunData[i][0] == this.order_day) {
          var code_product = {delivery:getJumunData[i][16],songjang_num:getJumunData[i][17], platform: getJumunData[i][1], date: getJumunData[i][0], su_name: getJumunData[i][4], su_num: getJumunData[i][5], product_name:getJumunData[i][9],cnt: getJumunData[i][11], code: getJumunData[i][21], row_num:getJumunData[i][22]}
          this.items.push(code_product)
          this.jumunData[k] = getJumunData[i]
          k++;
        }
    }
    },
    arrayTest () {
      this.listArray = []
      let tableToArray = new TableToArray();
      this.listArray = tableToArray.getArray('bb_list_table')
      this.listLen = this.listArray.length
    },
    updateData() {

    },

    saveToExcel() {
      var worksheet = xlsx.utils.table_to_book(document.getElementById('bb_list_table'));
      var opts = {bookType:'xlsx', bookSST:false, type:'binary'}
      var wbout = xlsx.write(worksheet, opts)
      fileSaver.saveAs(new Blob([this.s2ab(wbout)], {type:'application/octet-stream'}), this.selected_code + '.xlsx')
    },

    s2ab(s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for(var i = 0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    },

    getDate(date) {
      console.log(date)
      this.order_day = date
    },
    sendKakao(len,num) {
      this.arrayTest()
      if(num === len) {
        alert("알림톡 발송 완료")
      }
      if(num < len) {
        if(this.listArray[num][0] === true) {
          let customer = {
            delivery:this.listArray[num][1],
            songjang_num:this.listArray[num][2],
            date:this.listArray[num][4],
            su_name:this.listArray[num][5],
            phone:this.listArray[num][6],
            product_name:this.listArray[num][7],
            cnt:this.listArray[num][8],
            sau:this.sau
          }
          Axios.post('https://bagcw.com/kakao',customer).then((res) => {
            this.sendKakao(len,num + 1)
            console.log(res)
          }).catch((err) => {
            console.log(err)
          })
        }else{
          this.sendKakao(len,num + 1)
        }
      }
    },
    sendTemplate() {
      Axios.get('http://blackbagsoft.vps.phps.kr:3000/report',{crossdomain: true
      }).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    reportTemplate() {
      Axios.get('http://blackbagsoft.vps.phps.kr:3000/report/report',{crossdomain: true
      }).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  components: {
    DatePicker
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.order{padding:0 20px}
.com_code{margin:24px 0}
.list_table{margin-top:30px}
</style>