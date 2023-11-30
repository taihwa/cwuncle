<template>
  <div class="order">
    <h1>발주하기</h1>
    <input type="file" v-on:change="product_dataUpload($event)" value="엑셀업로드" />
    <b-button variant="danger" v-on:click="ac_productDataUpload(product_json)">파일전송</b-button>
    <DatePicker v-on:send-date="getDate"></DatePicker>
    <b-button variant="success" v-on:click="ac_getOrderData(order_day)">전체발주</b-button>
    <b-form-checkbox id="checkbox1" v-model="sum_table" value="accepted" unchecked-value="not_accepted">
      테이블 합치기
    </b-form-checkbox>
    <b-card title="업체명" class="com_code">
    <span v-for='uniq in getUniqCode' class="bal_btns">
      <b-button variant="outline-warning" v-on:click='getList(uniq)'>{{uniq}}</b-button>
      <b-button @click="order_complete">x</b-button>
    </span>
    </b-card>
    <b-form-select v-model="selected" :options="options" class="mb-3" />
    <b-button variant="success" v-on:click="saveToExcel()">엑셀다운</b-button>
    <b-button :pressed.sync="myToggle" class="ml-3" @click='sumPojang()' variant="primary">합포장 합치기</b-button>
    <b-row class="mt-3">
      <b-col>
        <b-btn @click="selectAllRows">전체선택</b-btn>
        <b-button variant="success" class="ml-3" v-on:click="ac_updateData(selectedRows)">수정</b-button>
      </b-col>
    </b-row>
    <b-table
    :fields="fields"
    bordered
    :items="items"
    v-if="def"
    class="list_table"
    selectable
    select-mode="multi"
    @row-selected="onRowSelected"
    tbody-tr-class="aaaa"
    ref="bb_list_table"
    id="bb_list_table">
      <template v-slot:cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span aria-hidden="true">&check;</span>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>
      <template v-slot:cell(date) = "data">
        <b-form-input v-model="data.item.date" class="date_input_width"></b-form-input>
      </template>
    </b-table>
    <Tae :customers="items" v-if="Tae"></Tae>
    <Jangwon :customers="items" v-if="Jangwon"></Jangwon>
    <Manggae :customers="items" v-if="Manggae"></Manggae>
    <Passion :customers="items" v-if="Passion"></Passion>
    <Hyunsuk :customers="items" v-if="Hyunsuk"></Hyunsuk>
    <Gumjin :customers="items" v-if="Gumjin"></Gumjin>
    <Dawon :customers="items" v-if="Dawon"></Dawon>
    <Chungyang :customers="items" v-if="Chungyang"></Chungyang>
    <Chung :customers="items" v-if="Chung"></Chung>
    <Boyang :customers="items" v-if="Boyang"></Boyang>
    <Purin :customers="items" v-if="Purin"></Purin>
    <Sungwon :customers="items" v-if="Sungwon"></Sungwon>
    <Haman :customers="items" v-if="Haman"></Haman>
    <Insam :customers="items" v-if="Insam"></Insam>
    <Durebak :customers="items" v-if="Durebak"></Durebak>
    <Chamsol :customers="items" v-if="Chamsol"></Chamsol>
    <Sol :customers="items" v-if="Sol"></Sol>
    <Jagal :customers="items" v-if="Jagal"></Jagal>
    <b-card v-for="item in items" v-if="talk">
      {{item.su}}<br /><br />
      {{item.su_num1}}  {{item.su_num2}}<br /><br />
      {{item.address}}<br /><br />
      {{item.product_name}} - {{item.cnt}}개<br /><br />
      {{item.message}}
    </b-card>
  </div>

</template>

<script>
import DatePicker from './DatePicker.vue'
import BButils from './service/bb_utils.js'
import xlsx from 'xlsx'
import TableToArray from './service/tableToArray.js'
import fileSaver from 'file-saver'
import Tae from './orderTable/Tae.vue'
import Jangwon from './orderTable/Jangwon.vue'
import Manggae from './orderTable/Manggae.vue'
import Passion from './orderTable/Passion.vue'
import Hyunsuk from './orderTable/Hyunsuk.vue'
import Gumjin from './orderTable/Gumjin.vue'
import Dawon from './orderTable/Dawon.vue'
import Chungyang from './orderTable/Chungyang.vue'
import Chung from './orderTable/Chung.vue'
import Boyang from './orderTable/Boyang.vue'
import Purin from './orderTable/Purin.vue'
import Sungwon from './orderTable/Sungwon.vue'
import Haman from './orderTable/Haman.vue'
import Insam from './orderTable/Insam.vue'
import Durebak from './orderTable/Durebak.vue'
import Chamsol from './orderTable/Chamsol.vue'
import Sol from './orderTable/Sol.vue'
import Jagal from './orderTable/Jagal.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Order',
  data () {
    return {
      selected:null,
      myToggle: false,
      sum_table: "not_accepted",
      complete:'outline-warning',
      options:[
        { value: null, text: '양식선택' },
        { value: 'def', text: '기본양식' },
        { value: 'talk', text: '카카오톡' },
        { value: 'Tae', text: '태양씨푸드' },
        { value: 'Jangwon', text: '장원식품' },
        { value: 'Manggae', text: '의령망개떡' },
        { value: 'Passion', text: '마녀의농장'},
        { value: 'Hyunsuk', text: '현숙된장'},
        { value: 'Gumjin', text: '금진수산'},
        { value: 'Dawon', text: '다원수산'},
        { value: 'Chungyang', text: '연화산농장'},
        { value: 'Chung', text: '청춘건어물'},
        { value: 'Boyang', text: '보양수산'},
        { value: 'Purin', text: '푸르린'},
        { value: 'Sungwon', text: '승운'},
        { value: 'Haman', text: '함안'},
        { value: 'Insam', text: '잎인삼파크'},
        { value: 'Durebak', text: '두레박'},
        { value: 'Chamsol', text: '참솔'},
        { value: 'Sol', text: '솔이네홍합'},
        { value: 'Jagal', text: '자갈치시장'}
      ],
      fields: [
        { key: 'chk', label: '' },
        { key: 'date', label: '날짜', thClass: 'bth', tdClass: 'btd' },
        { key: 'jumunja', label: '주문자', thClass: 'bth', tdClass: 'btd' },
        { key: 'jumun_num', label: '주문번호', thClass: 'bth', tdClass: 'btd' },
        { key: 'su', label: '수취인', thClass: 'bth', tdClass: 'btd' },
        { key: 'su_num1', label: '번호1', thClass: 'bth', tdClass: 'btd' },
        { key: 'su_num2', label: '번호2', thClass: 'bth', tdClass: 'btd' },
        { key: 'zipcode', label: '우편번호', thClass: 'bth', tdClass: 'btd' },
        { key: 'address', label: '주소', thClass: 'bth', tdClass: 'btd' },
        { key: 'product_name', label: '상품명', thClass: 'bth', tdClass: 'btd' },
        { key: 'cnt', label: '수량', thClass: 'bth', tdClass: 'btd' },
        { key: 'message', label: '메세지', thClass: 'bth', tdClass: 'btd' },
        { key: 'num', label: '넘버', thClass: 'bth', tdClass: 'btd' }
      ],
      items: [],
      listArray:[],
      orderData:null,
      progressive_bar:true,
      order_day:null,
      jumunData : [],
      uniqProduct_code: [],
      selected_code: null,
      counter:90,
      max:100,
      customer_json: [],
      product_json: null,
      test_json:[],
      selectedRows: [],
      Jagal:false,sol:false,talk:false,Tae:false,Jangwon:false,Manggae:false,Passion:false,Hyunsuk:false,Gumjin:false,Dawon:false,Chungyang:false,Chung:false,def:true,Boyang:false,Purin:false,Sungwon:false,Haman:false,Insam:false,Durebak:false,Chamsol:false
    }
  },
  created() {
    this.ac_getProductData()
  },
  computed: {
    ...mapGetters([
      'getOrderData',
      'getUniqCode',
      'getproductData'
    ])
  },

  watch: {
    selected: function(val) {
      if(val === "Tae") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = true;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Jangwon") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = true;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Manggae") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = true;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Passion") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = true;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Hyunsuk") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = true;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Gumjin") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = true;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Dawon") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = true;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Chungyang") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = true;this.Chung = false;this.def = false
      }
      if(val === "Chung") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = true;this.def = false
      }
      if(val === "def") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = true
      }
      if(val === "talk") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=true;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Boyang") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=true;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Purin") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=true;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Sungwon") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=true;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Haman") {
        this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=true;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Insam") {
        this.Chamsol=false;this.Durebak=false;this.Insam=true;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Durebak") {
        this.Chamsol=false;this.Durebak=true;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Chamsol") {
        this.Chamsol=true;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Sol") {
        this.Sol=true;this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }
      if(val === "Jagal") {
        this.Jagal=true;this.Sol=false;this.Chamsol=false;this.Durebak=false;this.Insam=false;this.Haman=false;this.Sungwon=false;this.Purin=false;this.Boyang=false;this.talk=false;this.Tae = false;this.Jangwon = false;this.Manggae = false;this.Passion = false;this.Hyunsuk = false;this.Gumjin = false;this.Dawon = false;this.Chungyang = false;this.Chung = false;this.def = false
      }

    }
  },
   methods: {
    ...mapActions([
      'ac_productDataUpload',
      'ac_getOrderData',
      'ac_updateData',
      'ac_getProductData'
    ]),
    onRowSelected (items) {
      this.selectedRows = items
    },
    selectAllRows () {
      this.$refs.bb_list_table.selectAllRows()
    },
    order_complete(event) {
      var btn = event.target.previousElementSibling;
      btn.className = "btn btn-danger"
    },
    product_dataUpload (e) {
      var rABS = true
      var files = e.target.files
      var f = files[0]
      var reader = new FileReader()
      reader.onload = (e) => {
        var data = e.target.result
        //var i
        if (!rABS) data = new Uint8Array(data)
        var workbook = xlsx.read(data, {type: rABS ? 'binary' : 'array', cellDates: true})
        var sheet = workbook.SheetNames[2]
        var json = xlsx.utils.sheet_to_json(workbook.Sheets[sheet])
        for(var i = 0; i < json.length; i++) {
            var now = new Date(json[i].date);
            //var now = new Date();
            var date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1));
            date = date.toISOString().slice(0, 10).replace(/-/g, '-');
            json[i].date = date;
            //2019-01-03 업데이트
            for(let v = 0; v < this.getproductData.length; v++) {
              for(let k = 0; k < this.getproductData[v].nongga_product.length; k++) {
                if(json[i].cw_code === this.getproductData[v].nongga_product[k].code) {
                  json[i].product_option = this.getproductData[v].nongga_product[k].name
                  json[i].product_code = this.getproductData[v].nongga_name
                  json[i].gong_price = parseInt(this.getproductData[v].nongga_product[k].gongprice) * parseInt(json[i].cnt)
                  if(json[i].delivery_pay === "0") {
                    if(!this.getproductData[v].nongga_product[k].deleveryCheck) {
                    json[i].pure_money = parseInt(json[i].jungsan_price) - parseInt(json[i].gong_price);
                    } else if(this.getproductData[v].nongga_product[k].deleveryCheck === 1) {

                      json[i].pure_money = parseInt(json[i].jungsan_price) - parseInt(json[i].gong_price)  - 3000//parseInt(this.getProductData[v].nongga_product[k].deliveryPrice);
                    } else {
                      json[i].pure_money = parseInt(json[i].jungsan_price) - parseInt(json[i].gong_price);
                    }
                  }
                }
              }
            }
            this.items.push(json[i]);
        }
        this.product_json = json;
      }
      if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f)
    },

    uploadToServer () {

    },

    sumPojang () {
      if(this.items) {
        var a = this.items.reduce(function (accumulator, current, index) {
        if (checkIfAlreadyExist(current)) {
          var findIndex = accumulator.findIndex((element) => {
            return element.product_code === current.product_code && element.su === current.su && element.address === current.address;
          });
          accumulator[findIndex].product_name = `${accumulator[findIndex].product_name} / ${current.product_name} - ${current.cnt}개`
          accumulator[findIndex].gong_price = accumulator[findIndex].gong_price +current.gong_price
          return accumulator
        } else {
          current.product_name = `${current.product_name} - ${current.cnt}개`
          return accumulator.concat([current]);
        }

        function checkIfAlreadyExist(currentVal) {
          return accumulator.some((item) => {
            return (item.product_code === currentVal.product_code && item.su === currentVal.su && item.address === currentVal.address);
          });
        }
      }, []);
      this.items = a;
      }
    },
    getList(code) {
      this.selected_code = code
      if(this.sum_table === "not_accepted") {
        this.items = []
      }
      for(var s = 0; s <this.getOrderData.length; s++) {

        if( this.selected_code === this.getOrderData[s].product_code) {
            if(this.getOrderData[s].product_option) {
              this.getOrderData[s].product_name = this.getOrderData[s].product_option
            }
          this.items.push(this.getOrderData[s])
        }
      }
    },

    saveToExcel() {
      var worksheet = xlsx.utils.table_to_book(document.getElementById('bb_list_table'));
      var opts = {bookType:'xlsx', bookSST:false, type:'binary'}
      var wbout = xlsx.write(worksheet, opts)
      fileSaver.saveAs(new Blob([this.s2ab(wbout)], {type:'application/octet-stream'}), this.selected_code+ '_' + this.order_day + '.xlsx')
    },

    s2ab(s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for(var i = 0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    },
    getDate(date) {
      this.order_day = date
    },
    arrayTest () {
      this.listArray = []
      let tableToArray = new TableToArray();
      this.listArray = tableToArray.getJson('bb_list_table')
      console.log(this.listArray)
      //this.listLen = this.listArray.length
    },
  },
  components: {
    DatePicker,
    Tae,
    Jangwon,
    Manggae,
    Passion,
    Hyunsuk,
    Gumjin,
    Dawon,
    Chungyang,
    Chung,
    Boyang,
    Purin,
    Sungwon,
    Haman,
    Insam,
    Durebak,
    Chamsol,
    Sol,
    Jagal
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.order{padding:0 20px}
.com_code{margin:24px 0}
.list_table{margin-top:30px}
.progressive_bar{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0, 0, 0, 0.3);z-index:200 }
.progressive_bar p{font-size:32px;font-weight: bold;text-align: center}
.progressive_bar .cont_wrap{position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;width:400px;height:200px}
.bal_btns{display:inline-block;margin:10px}
.bth{word-break:keep-all;text-align: center;text-align:center!important; background-color:greenyellow!important;}
.btd{text-overflow: ellipsis;overflow:hidden;white-space:nowrap}
.date_input_width{width:110px!important}
</style>