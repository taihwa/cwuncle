<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col class="my-2">
        <h3>송장 내려받기</h3>
        <b-form-select v-model="platform_selected" :options="options" class="mb-3" />
        <input type="file" variant="success" v-on:change="uploadExcel($event)">송장업로드</b-button>
        <b-button variant="success" v-on:click="saveToExcel()">엑셀다운</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="my-2">
        <h3>알림톡 발송</h3>
        <b-form-select v-model="kakaoTemplate" :options="options1" class="mb-3" />
        <b-form-textarea v-model="sau" type="text" :rows="3" placeholder="발송지연사유"></b-form-textarea>
        <b-button class="mt-1" variant="success" v-on:click="sendKakao(0)">알림톡 발송</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6" class="my-2">
        <b-form-group horizontal label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Per page" class="mb-0">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <label for="allSelect">전체선택</label>
    <input type="checkbox" id="allSelect" v-model="allCheck" @click="allSelect" />
    <b-table show-empty
             stacked="md"
             :items="item"
             :fields="fields"
             :filter="filter"
             @filtered="onFiltered"
             class="list_table" id="bb_list_table"
    >
      <template slot="chk" slot-scope="data">
          <input type="checkbox" :value="data.item" v-model="chk_selected" />
      </template>
      <template v-slot:cell(actions)="row">
        <b-button size="sm" @click.stop="updateRow(row.item, row.index, $event.target)" class="mr-1">
          수정
        </b-button>
        <b-button size="sm" variant="danger" @click="showMsgBoxOne(row.item)" class="mr-1">
          삭제
        </b-button>
      </template>
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>
    <b-modal id="modalUpdate" @hide="resetModal" title="수정하기" @ok="ac_updateData(modalUpdate.content)">
      <b-row class="my-1">
        <b-col sm="3"><label>날짜</label></b-col>
        <b-col sm="9"><b-form-input v-model="modalUpdate.content.date"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>플랫폼</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.platform"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>주문자</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.jumunja"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>주문자 번호</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.jumun_num"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>수취인</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.su"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>수취인 번호1</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.su_num1"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>수취인 번호2</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.su_num2"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>우편번호</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.zipcode"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>주소</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.address"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>상품명</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.product_name"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>상품옵션</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.product_option"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>개수</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.cnt"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>옵션코드</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.option_code"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>배송료</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.delivery_pay"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>상품주문번호</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.jumun_number"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>택배사</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.delivery_company"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>송장번호</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.delivery_num"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>제품코드</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.product_code"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>공급가</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.gong_price"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>정산가</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.jungsan_price"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>판매가</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.sell_price"></b-form-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>취소/환불</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.cancle"></b-form-input></b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import xlsx from 'xlsx'
import fileSaver from 'file-saver'
import Axios from 'axios'
import TableToArray from './service/tableToArray.js'
export default {
   data () {
    return {
      fields: [
        { key: 'chk', label: '' },
        { key: 'actions', label:'수정'},
        { key: 'date', label: '날짜' },
        { key: 'cancle', label: '취소/환불' },
        { key: 'jumun_number', label: '상품주문번호' },
        { key: 'delivery_company', label: '택배사' },
        { key: 'delivery_num', label: '송장번호' },
        { key: 'jumunja', label: '주문자' },
        { key: 'jumun_num', label: '주문번호' },
        { key: 'su', label: '수취인' },
        { key: 'su_num1', label: '번호1' },
        { key: 'su_num2', label: '번호2' },
        { key: 'zipcode', label: '우편번호' },
        { key: 'address', label: '주소' },
        { key: 'product_name', label: '상품명' },
        { key: 'cnt', label: '수량' },
        { key: 'message', label: '메세지' },
        { key: 'platform', label:'플랫폼' },
        { key: 'product_code', label:'상품코드' },
        { key: 'gong_price', label:'공급가' },
        { key: 'sell_price', label:'판매가' },
        { key: 'jungsan_price', label:'정산금액' },
        { key: 'num', label:'넘버' }
      ],
      currentPage: 1,
      perPage: 500,
      pageOptions: [ 500, 1000, 2000 ],
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      modalInfo: {},
      inputEdit: false,
      checkedRows : [],
      options1: [
        { value: null, text: "양식선택" },
        { value: "CU5", text: "배송지연안내" },
        { value: "CU6", text: "상품먹는법안내" }
      ],
      options: [
        { value: null, text: "플랫폼선택" },
        { value: "all", text: "전체보기" },
        { value: "네이버", text: "네이버" },
        { value: "옥션", text: "옥션" },
        { value: "쿠팡", text: "쿠팡" },
        { value: "11번가", text: "11번가" },
        { value: "K쇼핑", text: "K쇼핑" }
      ],
      selected: null,
      kakaoTemplate: null,
      sau: null,
      allCheck: false,
      platform_selected:null,
      item : [],
      chk_selected: [],
      modalUpdate : {
        title: '',
        content:
        {
          date: '',
          timestamp: '',
          jumunja: '',
          jumun_num: '',
          su: '',
          su_num1: '',
          su_num2: '',
          zipcode: '',
          address: '',
          product_name: '',
          product_option: '',
          cnt: '',
          message: '',
          option_code: '',
          delivery_pay: '',
          jumun_number: '',
          delivery_company: '',
          delivery_num: '',
          num: '',
          product_code: '',
          gong_price: '',
          jungsan_price: '',
          sell_price: '',
          cancle: '',
          flag:''
        }
      }
    }
  },
  props: ['customers'],
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    },
    totalRows : function() {
      if(this.customers) {
        return this.customers.length
      }
    }
  },
  watch: {
    platform_selected : function(val) {
      console.log(this.customers)
      this.item = []
      for(let i = 0; i < this.customers.length; i++) {
        if(val === this.customers[i].platform) {
          this.item[i] = this.customers[i]
        }
        if(val === "all") {
          this.item[i] = this.customers[i]
        }
      }
    }
  },
  methods: {
      ...mapActions([
      'ac_getDateData',
      'ac_updateData',
      'ac_deleteData'
    ]),
    updateRow (item, index, button) {
      this.modalUpdate.title = `Row index: ${index}`
      this.modalUpdate.content = item
      this.modalUpdate.content['flag'] = 'single'
      this.$root.$emit('bv::show::modal', 'modalUpdate', button)
    },
    resetModal () {
      this.modalInfo.title = ''
      this.modalInfo.content = ''
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    chanegeInput (item, index, event) {
      this.item[index]['edit'] = true
      this.$forceUpdate();
    },
    noShow (index, field) {
      this.item[index]['edit'] = false
      this.$forceUpdate();
    },
    uploadExcel (e) {
      this.items = [];
      var rABS = true
      var files = e.target.files
      var f = files[0]
      var reader = new FileReader()

      reader.onload = (e) => {
        var data = e.target.result
        var i
        if (!rABS) data = new Uint8Array(data)
        var workbook = xlsx.read(data, {type: rABS ? 'binary' : 'array'})
        var sheet = workbook.SheetNames[0]
        var json = xlsx.utils.sheet_to_json(workbook.Sheets[sheet],{dateNF:15})
        for(let i = 0; i < this.item.length; i++) {
          for(let k = 0; k < json.length; k++) {
            var name_address = this.item[i].su + this.item[i].address
            var songjang_name_address = json[k]['이름'] + json[k]['주소']
            if(name_address === songjang_name_address) {
              this.item[i].delivery_num = json[k]['송장']
              this.item[i].delivery_company = json[k]['택배사']
            }
          }
        }
      }
      if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f)
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

    allSelect() {
      this.chk_selected = []
      if (!this.allCheck) {
        for (let i in this.item) {
          this.chk_selected.push(this.item[i])
        }
      }
    },

    sendKakao(num) {
       let len = this.chk_selected.length
      if(num === len) {
        alert("발송완료")
      }
      if (num < len) {
          let customer = {
            delivery: this.chk_selected[num].delivery_company,
            songjang_num: this.chk_selected[num].delivery_num,
            date: this.chk_selected[num].date,
            su_name: this.chk_selected[num].su,
            phone: this.chk_selected[num].su_num1,
            product_name: this.chk_selected[num].product_name,
            cnt: this.chk_selected[num].cnt,
            jumunja : this.chk_selected[num].jumunja,
            sau: this.sau,
            kakaoTemplate: this.kakaoTemplate
          }

          Axios.post("https://bagcw.com/kakao", customer)
            .then(res => {
              this.sendKakao(num + 1);
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
      }else if(num === len) {
        alert('발송완료')
      }
    },
    showMsgBoxOne (data) {
      console.log(this.$bvModal)
      this.$bvModal.msgBoxConfirm('삭제하시겠습니까?')
        .then(value => {
          if(value) this.ac_deleteData(data)
        })
        .catch(err => {
          // An error occurred
        })
    }
  }
}
</script>
<style>

</style>