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
        <b-button variant="outline-success" @click="getSearch()">검색</b-button>
      </b-col>
    </b-row>
    <b-form-select v-model="methodSelected" :options="methodOptions"></b-form-select>
    <b-row v-if="methodSelected == 'sms'">
      <b-col>
        <b-badge pill variant="primary">{{getByte}} Byte</b-badge>
        <b-badge variant="warning">SMS 90Byte 이하(9.9원) LMS 90 Byte 이상(32원)</b-badge>
        <b-form-textarea
          id="textarea-formatter"
          v-model="smsText"
          placeholder="내용"
          :formatter="smsformatter"
          class="mt-3"
        ></b-form-textarea>
        <b-button class="mt-3" variant="outline-danger" @click="sendSms()">보내기</b-button>
      </b-col>
    </b-row>

    <b-row v-if="methodSelected == 'kakao'">
      <b-col>
        <b-badge pill variant="primary">{{getByte}} Byte</b-badge>
        <b-form-group label="알림톡 템플릿 선택" v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            id="btn-radios-1"
            v-model="kakaoTemplateSelected"
            :options="kakaoTemplateOptions"
            :aria-describedby="ariaDescribedby"
            name="radios-btn-default"
            buttons
          ></b-form-radio-group>
        </b-form-group>
        <b-card title="배송지연 템플릿" bg-variant="warning" v-if="kakaoTemplateSelected == 'CU5'">
          <b-card-text>
            ▶ 상품명 : #{상품명}<br>
            ▶ 주문자명 : #{주문자명}<br>
            ▶ 수취인명 : #{수취인명}<br>
            ▶ 발송지연 사유 : #{발송지연사유}<br>

            문의사항 있으시면 카카오톡으로 문의 주시면 성실히 답변 드리겠습니다.
            카카오톡 문의 시간 : 아침 9:00 ~ 저녁 6:00
          </b-card-text>
        </b-card>
        <b-card title="주문내역확인 템플릿" bg-variant="warning" v-if="kakaoTemplateSelected == 'CU6'">
          <b-card-text>
            안녕하세요 창원아재들입니다. 저희 스토어를 이용해 주셔서 감사합니다. 주문하신 내역은 아래와 같습니다. 혹시 물건을 수령을 못하셨을 경우나 상품에 대한 문의사항이 있으신 경우 플러스 친구로 연락주세요~
            <br>
            - 상품 : #{product}<br>
            - 주문자명 : #{주문자명}<br>
            - 수취인명 : #{name}<br>
            - 발송일 : #{send_time}<br>
            - 수령예정일 : #{get_time}<br>
            - 운송장번호 : #{delivery} - #{delivery_number}<br>
            - 상품 먹는법/주의점/팁 : #{팁}<br>
          </b-card-text>
        </b-card>
        <b-form-textarea
          id="textarea-formatter"
          v-model="smsText"
          :placeholder="(kakaoTemplateSelected == 'CU5') ? '발송지연사유 적기' : '상품 먹는법/주의점/팁 적기'"
          :formatter="smsformatter"
          class="mt-3"
        ></b-form-textarea>
        <b-button class="mt-3" variant="outline-danger" @click="sendKakao()">보내기</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button class="mt-3" variant="outline-info" @click="selectAllRows()">전체선택</b-button>
        <b-button class="mt-3" variant="outline-success" @click="unSelectAllRows()">전체선택취소</b-button>

      </b-col>
    </b-row>
    <b-table
      :fields="fields"
      :items="items"
      selectable
      select-mode="multi"
      @row-selected="onRowSelected"
      ref="bb_selectable_table"
      class="mt-3"
    >
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
    </b-table>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Axios from 'axios'
export default {
  data () {
    return {
      kakaoTemplateSelected: 'CU5',
      kakaoTemplateOptions: [
        { text: '배송지연안내', value: 'CU5' },
        { text: '주문내역안내', value: 'CU6' }
      ],
      methodOptions: [
        { value: 'sms', text: '문자' },
        { value: 'kakao', text: '알림톡' }
      ],
      methodSelected: 'sms',
      smsText: '',
      items: [],
      searchs: {
        searchSelected: '',
        date1: '',
        date2: ''
      },
      fields: [
        { key: 'chk', label: '', thClass: 'bth', tdClass: 'btd' },
        { key: 'date', label: '날짜', thClass: 'bth', tdClass: 'btd' },
        { key: 'jumunja', label: '주문자', thClass: 'bth', tdClass: 'btd' },
        { key: 'jumun_num', label: '주문번호', thClass: 'bth', tdClass: 'btd' },
        { key: 'su', label: '수취인', thClass: 'bth', tdClass: 'btd' },
        { key: 'su_num1', label: '번호1', thClass: 'bth', tdClass: 'btd' },
        { key: 'su_num2', label: '번호2', thClass: 'bth', tdClass: 'btd' },
        { key: 'address', label: '주소', thClass: 'bth', tdClass: 'btd' },
        { key: 'product_option', label: '상품명', thClass: 'bth', tdClass: 'btd' },
        { key: 'cnt', label: '수량', thClass: 'bth', tdClass: 'btd' },
        { key: 'message', label: '메세지', thClass: 'bth', tdClass: 'btd' },
        { key: 'platform', label: '플랫폼', thClass: 'bth', tdClass: 'btd' },
        { key: 'product_code', label: '상품코드', thClass: 'bth', tdClass: 'btd' },
        { key: 'num', label: '넘버', thClass: 'bth', tdClass: 'btd' }
      ],
      selectedRows: [],
      getByte: 0
    }
  },
  created () {
    this.ac_getProductData()
    this.setSearchDate()
    if (this.getproductData) {
      this.searchOptions = this.getproductData.map((item) => {
        return { value: item.nongga_name, text: item.nongga_name }
      })
    }
  },
  computed: {
    ...mapGetters([
      'getproductData'
    ]),
    searchOptions () {
      let options = []
      if (this.getproductData) {
        options = this.getproductData.map((item) => {
          return { value: item.nongga_name, text: item.nongga_name }
        })
      }
      return options
    }
  },
  methods: {
    ...mapActions([
      'ac_getProductData'
    ]),
    async sendSms () {
      let data = {
        phone: '',
        text: ''
      }
      for (let i = 0; i < this.selectedRows.length; i++) {
        if (this.selectedRows.length - 1 === i) {
          data.phone += `${this.selectedRows[i].su_num1}`
        } else {
          data.phone += `${this.selectedRows[i].su_num1},`
        }
      }
      data.text = this.smsText
      const { data: { success, msg } } = await Axios.post('https://bagcw.com/jumun/sendSms', data)
      if (success) {
        alert(msg)
      } else {
        alert('문자 보내기 실패')
      }
    },
    async sendKakao () {
      if (this.selectedRows.length > 0) {
        let sendData = this.selectedRows.map((row) => {
          if (row.jumun_number == null) {
            row.jumun_num = row.su_num1
            row.jumunja = row.su
          }
          var json = {
            phone: row.jumun_num,
            name: row.su,
            product_name: row.product_name,
            date: row.date,
            delivery: row.delivery_company,
            songjang: row.delivery_num,
            jumunja: row.jumunja,
            sau: this.smsText,
            kakaoTemplate: this.kakaoTemplateSelected,
            cnt: row.cnt
          }
          return json
        })
        const { data } = await Axios.post('https://bagcw.com/kakao', sendData)
        console.log(data)
      }
    },
    smsformatter (value) {
      this.getByte = value.split('')
        .map(s => s.charCodeAt(0))
        .reduce((prev, c) => (prev + ((c === 10) ? 2 : ((c >> 7) ? 2 : 1))), 0)
      return value
    },
    setCompanyOptions () {
      console.log(this.getproductData)
      if (this.getproductData) {
        this.searchOptions = this.getproductData.map((item) => {
          return { value: item.nongga_name, text: item.nongga_name }
        })
      }
    },
    setSearchDate () {
      const now = new Date()
      let date2 = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
      date2 = date2.toISOString().slice(0, 10).replace(/-/g, '-')
      this.searchs.date2 = date2
      this.searchs.date1 = date2
    },
    onRowSelected (items) {
      this.selectedRows = items
    },
    selectAllRows () {
      this.$refs.bb_selectable_table.selectAllRows()
    },
    unSelectAllRows () {
      this.$refs.bb_selectable_table.clearSelected()
    },
    async getSearch () {
      const result = await Axios.post('https://bagcw.com/jumun/search1', this.searchs)
      if (result.data.length > 0) {
        this.items = result.data
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
    }
  }
}
</script>
<style>
.bth{word-break:keep-all;text-align: center;text-align:center!important; background-color:greenyellow!important;}
.btd{text-overflow: ellipsis;overflow:hidden;white-space:nowrap}
</style>
