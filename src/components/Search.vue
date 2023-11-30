<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col>
        <b-input-group class="mb-3">
          <b-form-input
            id="example-input"
            v-model="searchs.date1"
            type="text"
            placeholder="YYYY-MM-DD"
            autocomplete="off"
          ></b-form-input>
          <b-input-group-append>
            <b-form-datepicker
              v-model="searchs.date1"
              button-only
              right
              locale="en-US"
              aria-controls="example-input"
            ></b-form-datepicker>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col>
        <b-input-group class="mb-3">
          <b-form-input
            id="example-input1"
            v-model="searchs.date2"
            type="text"
            placeholder="YYYY-MM-DD"
            autocomplete="off"
          ></b-form-input>
          <b-input-group-append>
            <b-form-datepicker
              v-model="searchs.date2"
              button-only
              right
              locale="en-US"
              aria-controls="example-input"
            ></b-form-datepicker>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col>
        <b-form-select
          v-model="searchs.searchSelected"
          :options = "searchOptions"
        ></b-form-select>
      </b-col>
      <b-col>
        <b-form-input v-model="searchs.text"></b-form-input>
      </b-col>
      <b-col>
        <b-button variant="outline-success" @click="getSearch()">검색</b-button>
      </b-col>
    </b-row>
    <b-table
      :fields="fields"
      :items="items"
    >
       <template v-slot:cell(actions)="row">
        <b-button size="sm" @click.stop="updateRow(row.item, row.index, $event.target)" class="mr-1">
          수정
        </b-button>
        <b-button size="sm" variant="danger" @click="showMsgBoxOne(row.item)" class="mr-1">
          삭제
        </b-button>
      </template>
    </b-table>
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
        <b-col sm="3"><label>배송메세지</label></b-col>
        <b-col sm="9"><b-form-input  v-model="modalUpdate.content.message"></b-form-input></b-col>
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
import { mapGetters, mapActions } from 'vuex'
import Axios from 'axios'
export default {
  data () {
    return {
      items: [],
      searchs: {
        text: '',
        searchSelected: 'su',
        date1: '',
        date2: ''
      },
      searchOptions: [
        { value: 'su', text: '수취인' },
        { value: 'jumunja', text: '주문자' },
        { value: 'su_num1', text: '연락처' }
      ],
      fields: [
        { key: 'chk', label: '', thClass: 'bth', tdClass: 'btd' },
        { key: 'actions', label: '수정', thClass: 'bth', tdClass: 'btd' },
        { key: 'date', label: '날짜', thClass: 'bth', tdClass: 'btd' },
        { key: 'cancle', label: '취소/환불', thClass: 'bth', tdClass: 'btd' },
        { key: 'jumun_number', label: '상품주문번호', thClass: 'bth', tdClass: 'btd' },
        { key: 'delivery_company', label: '택배사', thClass: 'bth', tdClass: 'btd' },
        { key: 'delivery_num', label: '송장번호', thClass: 'bth', tdClass: 'btd' },
        { key: 'jumunja', label: '주문자', thClass: 'bth', tdClass: 'btd' },
        { key: 'jumun_num', label: '주문번호', thClass: 'bth', tdClass: 'btd' },
        { key: 'su', label: '수취인', thClass: 'bth', tdClass: 'btd' },
        { key: 'su_num1', label: '번호1', thClass: 'bth', tdClass: 'btd' },
        { key: 'su_num2', label: '번호2', thClass: 'bth', tdClass: 'btd' },
        { key: 'zipcode', label: '우편번호', thClass: 'bth', tdClass: 'btd' },
        { key: 'address', label: '주소', thClass: 'bth', tdClass: 'btd' },
        { key: 'product_option', label: '상품명', thClass: 'bth', tdClass: 'btd' },
        { key: 'cnt', label: '수량', thClass: 'bth', tdClass: 'btd' },
        { key: 'message', label: '메세지', thClass: 'bth', tdClass: 'btd' },
        { key: 'platform', label: '플랫폼', thClass: 'bth', tdClass: 'btd' },
        { key: 'product_code', label: '상품코드', thClass: 'bth', tdClass: 'btd' },
        { key: 'gong_price', label: '공급가', thClass: 'bth', tdClass: 'btd' },
        { key: 'sell_price', label: '판매가', thClass: 'bth', tdClass: 'btd' },
        { key: 'jungsan_price', label: '정산금액', thClass: 'bth', tdClass: 'btd' },
        { key: 'num', label: '넘버', thClass: 'bth', tdClass: 'btd' }
      ],
      modalUpdate: {
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
          flag: ''
        }
      }
    }
  },
  created () {
    const now = new Date()
    let date2 = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
    let date1 = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 7))
    date2 = date2.toISOString().slice(0, 10).replace(/-/g, '-')
    date1 = date1.toISOString().slice(0, 10).replace(/-/g, '-')
    this.searchs.date2 = date2
    this.searchs.date1 = date1
  },
  computed: {

  },
  methods: {
    ...mapActions([
      'ac_getDateData',
      'ac_updateData',
      'ac_deleteData'
    ]),
    async getSearch () {
      const result = await Axios.post('https://bagcw.com/jumun/search', this.searchs)
      if (result.data.length > 0) {
        this.items = result.data.map((item) => {
          let now = new Date(item.date)
          let date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
          item.date = date.toISOString().slice(0, 10).replace(/-/g, '-')
          return item
        })
      } else {
        alert('찾지 못함')
      }
    },
    updateRow (item, index, button) {
      this.modalUpdate.title = `Row index: ${index}`
      this.modalUpdate.content = item
      this.modalUpdate.content['flag'] = 'single'
      this.$root.$emit('bv::show::modal', 'modalUpdate', button)
    },
    resetModal () {
      this.modalUpdate.title = ''
      this.modalUpdate.content = ''
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    chanegeInput (item, index, event) {
      this.item[index]['edit'] = true
      this.$forceUpdate()
    },
    noShow (index, field) {
      this.item[index]['edit'] = false
      this.$forceUpdate()
    },
    showMsgBoxOne (data) {
      this.$bvModal.msgBoxConfirm('삭제하시겠습니까?')
        .then(value => {
          if (value) {
            this.ac_deleteData(data)
          }
        }).catch(err => {
          throw err
        })
    }
  }
}
</script>
<style>
.bth{word-break:keep-all;text-align: center;text-align:center!important; background-color:greenyellow!important;}
.btd{text-overflow: ellipsis;overflow:hidden;white-space:nowrap}
</style>
