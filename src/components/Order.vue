<template>
  <div class="order">
    <h1>발주하기</h1>
    <b-row>
      <b-col>
        <input type="file" v-on:change="product_dataUpload($event)" value="엑셀업로드" />
        <b-button variant="danger" v-on:click="ac_productDataUpload(product_json)">파일전송</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label for="example-input">날짜선택</label>
        <b-input-group class="mb-3">
          <b-form-input
            id="example-input"
            v-model="order_day"
            type="text"
            placeholder="YYYY-MM-DD"
            autocomplete="off"
          ></b-form-input>
          <b-input-group-append>
            <b-form-datepicker
              v-model="order_day"
              button-only
              right
              locale="en-US"
              aria-controls="example-input"
            ></b-form-datepicker>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-button variant="success" v-on:click="ac_getOrderData(order_day)">전체발주</b-button>
    <b-form-checkbox id="checkbox1" v-model="sum_table" value="accepted" unchecked-value="not_accepted">
      테이블 합치기
    </b-form-checkbox>
    <b-card title="업체명" class="com_code">
    <span v-for='(uniq, index) in getUniqCode' class="bal_btns" :key="index">
      <b-button variant="outline-warning" v-on:click='getList(uniq)'>{{uniq}}</b-button>
      <b-button @click="order_complete">x</b-button>
    </span>
    </b-card>
    <b-button @click="templateModal = !templateModal" variant="info" class="mb-3">템플릿 생성</b-button>
    <b-form-select @change="selectTemplate($event)" :options="options" class="mb-3" />
    <b-button variant="success" v-on:click="saveToExcel()">엑셀다운</b-button>
    <span v-for="(orderType, index) in orderTypes" :key="index">
      <b-button variant="outline-warning" @click="sendAnyThing(orderType)" class="ml-3">{{ orderType === "companyEmail" ? "업체 이메일 발송" : orderType === "deliveryEmail" ? "택배사 이메일 발송" : orderType === "kakaoTalk" ? "카카오톡 발송" : orderType === "sms" ? "문자 발송" : ""}}</b-button>
    </span>
    <b-row class="mt-3">
      <b-col>
        <b-btn @click="selectAllRows">전체선택</b-btn>
        <b-button variant="success" class="ml-3" v-on:click="ac_updateData1(selectedRows)">수정</b-button>
      </b-col>
    </b-row>
    <b-table
    v-if="def"
    :fields="fields"
    bordered
    :items="items"
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
    <b-table
    v-if="customTable"
    :fields="fields"
    bordered
    :items="items"
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
    <div v-if="talk">
      <b-card v-for="(item, key) in items" :key="key">
        {{item.su}}<br /><br />
        {{item.su_num1}}  {{item.su_num2}}<br /><br />
        {{item.address}}<br /><br />
        {{item.product_name}}<br /><br />
        {{item.message}}
      </b-card>
    </div>
    <b-modal v-model="templateModal" size="xl" title="템플릿 만들기">
      <b-row>
        <b-col>
          <b-form-select :options="nonggaName" @change="selectModalTemplate($event)" v-model="templateName"></b-form-select>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <b-btn block variant="success" @click="addField()">필드 추가</b-btn>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col v-for="(templateInput, index) in templateInputs" :key="index" cols="2" class="mb-5">
          <b-form-input :placeholder="`제목${index+1}`" v-model="templateInput.text"></b-form-input>
          <b-btn @click="changeForm(index)">폼 변경</b-btn>
          <b-form-select :options="templateOptions" v-if="templateInput.visible" v-model="templateInput.value"></b-form-select>
          <b-form-input v-if="!templateInput.visible" v-model="templateInput.value" placeholder="내용"></b-form-input>
          <b-btn @click="removeTemplateInput(index)" variant="danger">삭제</b-btn>
        </b-col>
      </b-row>
      <template v-slot:modal-footer>
        <b-btn @click="templateSave">저장</b-btn>
        <b-btn @click="templateModalClose()">닫기</b-btn>
      </template>
    </b-modal>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import fileSaver from 'file-saver'
import { mapActions, mapGetters } from 'vuex'
import Axios from 'axios'
import Vue from 'vue'

export default {
  name: 'Order',
  data () {
    return {
      orderTypes: [],
      companyEmail: '',
      deliveryEmail: '',
      kakaoTalk: '',
      sms: '',
      templateName: '',
      templateOptions: [
        { text: '상점명', value: 'product_code' },
        { text: '주문자', value: 'jumunja' },
        { text: '주문자 연락처', value: 'jumun_num' },
        { text: '수취인', value: 'su' },
        { text: '수취인 연락처1', value: 'su_num1' },
        { text: '수취인 연락처2', value: 'su_num2' },
        { text: '우편번호', value: 'zipcode' },
        { text: '주소', value: 'address' },
        { text: '상품명', value: 'product_option' },
        { text: '수량', value: 'cnt' },
        { text: '배송메세지', value: 'message' }
      ],
      templateInputs: [],
      templateInput: {
        text: '',
        value: '',
        visible: true
      },
      templateModal: false,
      selected: null,
      myToggle: false,
      sum_table: 'not_accepted',
      complete: 'outline-warning',
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
      listArray: [],
      orderData: null,
      order_day: null,
      jumunData: [],
      uniqProduct_code: [],
      selected_code: null,
      counter: 90,
      max: 100,
      customer_json: [],
      product_json: null,
      test_json: [],
      formatted: '',
      selectedDate: '',
      def: true,
      talk: false,
      customTable: false,
      options: [
        { value: 'def', text: '기본 템플릿' },
        { value: 'talk', text: '카톡 템플릿' },
        { value: 'customTable', text: '업체 템플릿' }
      ],
      selectedRows: [],
      templateFields: []
    }
  },
  created () {
    this.ac_getProductData()
  },
  computed: {
    ...mapGetters([
      'getOrderData',
      'getUniqCode',
      'getproductData'
    ]),
    nonggaName () {
      if (this.getproductData) {
        let nonggaNames = this.getproductData.map((item) => {
          return { text: item.nongga_name, value: item.num }
        })
        return nonggaNames
      } else {
        return []
      }
    }
  },
  methods: {
    ...mapActions([
      'ac_productDataUpload',
      'ac_getOrderData',
      'ac_updateData1',
      'ac_getProductData'
    ]),
    async sendAnyThing (type) {
      // var worksheet = xlsx.utils.table_to_json  (document.getElementById('bb_list_table'))
      // var opts = { bookType: 'xlsx', bookSST: false, type: 'buffer' }
      // var wbout = xlsx.write(worksheet, opts)
      const json = this.tableToJson(document.getElementById('bb_list_table'))

      if (type === 'companyEmail') {
        const { data: { success, msg } } = await Axios.post('https://bagcw.com/jumun/send', { type: type, info: this[type], json: json })
        if (success) {
          alert(msg)
        } else {
          alert('메일 보내기 실패')
        }
      }
      if (type === 'deliveryEmail') {
        const { data: { success, msg } } = await Axios.post('https://bagcw.com/jumun/send', { type: type, info: this[type], json: json })
        if (success) {
          alert(msg)
        } else {
          alert('메일 보내기 실패')
        }
      }
      if (type === 'sms') {
        const { data: { success, msg } } = await Axios.post('https://bagcw.com/jumun/send', { type: type, info: this[type], json: json })
        if (success) {
          alert(msg)
        } else {
          alert('문자 보내기 실패')
        }
      }
      if (type === 'kakaoTalk') {
        console.log(this[type])
      }
    },
    tableToJson (table) { // 변환 함수
      console.log(table.childNodes)
      var data = []
      for (let i = 0; i < table.childNodes[3].rows.length; i++) {
        let json = {}
        for (let k = 0; k < table.childNodes[3].rows[i].cells.length; k++) {
          json[this.fields[k].label] = table.childNodes[3].rows[i].cells[k].innerText
        }
        console.log(json)
        data[i] = json
      }
      return data
    },
    async selectModalTemplate (e) {
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      const { data: { success, data } } = await Axios.get(`https://bagcw.com/product/template?num=${e}`)
      if (success) {
        if (data) {
          this.templateInputs = data
        } else {
          this.templateInputs = []
        }
      } else {
        alert('불러오기 실패')
      }
    },
    templateModalClose () {
      this.templateModal = false
      this.templateInputs = []
    },
    async templateSave () {
      if (!this.templateName) {
        alert('거래처를 선택해 주세요!')
        return
      }
      console.log(this.templateInputs)
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      const { data: { success, msg } } = await Axios.post('https://bagcw.com/product/template', { template: JSON.stringify(this.templateInputs), num: this.templateName })
      if (success) {
        alert(msg)
        this.templateInputs = []
        this.templateModal = false
      } else {
        alert('저장 실패')
      }
    },
    addField () {
      this.templateInputs.push(Vue.util.extend({}, this.templateInput))
    },
    removeTemplateInput (index) {
      Vue.delete(this.templateInputs, index)
    },
    changeForm (index) {
      if (this.templateInputs[index].visible) {
        this.templateInputs[index].visible = false
      } else {
        this.templateInputs[index].visible = true
      }
    },
    onRowSelected (items) {
      this.selectedRows = items
    },
    selectAllRows () {
      this.$refs.bb_list_table.selectAllRows()
    },
    selectTemplate (value) {
      if (value === 'talk') {
        this.def = false
        this.customTable = false
        this.talk = true
      }
      if (value === 'def') {
        this.def = true
        this.customTable = false
        this.talk = false
        this.setDefTemplate()
      }
      if (value === 'customTable') {
        this.def = false
        this.customTable = true
        this.talk = false
        this.setCustomTable()
      }
    },
    setDefTemplate () {
      if (this.sum_table === 'not_accepted') {
        this.items = []
      }
      this.fields = [
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
      ]
      for (var s = 0; s < this.getOrderData.length; s++) {
        if (this.selected_code === this.getOrderData[s].product_code) {
          if (this.getOrderData[s].product_option) {
            this.getOrderData[s].product_name = this.getOrderData[s].product_option
          }
          this.items.push(this.getOrderData[s])
        }
      }
    },
    setCustomTable () {
      if (this.customTemplate) {
        var a = this.customTemplate.reduce(function (accumulator, current, index) {
          if (checkIfAlreadyExist(current)) {
            current.dup = index
            return accumulator.concat([current])
          } else {
            return accumulator.concat([current])
          }

          function checkIfAlreadyExist (currentVal) {
            return accumulator.some((item) => {
              return (item.value === currentVal.value)
            })
          }
        }, [])
        let result = a.map((item, index) => {
          let json = {}
          if (item.dup) {
            json.key = `a${item.dup}`
            json.label = item.text
            json.thClass = 'bth'
            json.tdclass = 'btd'
          } else {
            json.key = item.value
            json.label = item.text
            json.thClass = 'bth'
            json.tdclass = 'btd'
          }
          for (let k = 0; k < this.items.length; k++) {
            if (this.items[k][json.key] === undefined) {
              this.items[k][json.key] = item.value
            }
          }
          return json
        })
        this.fields = result
      } else {
        alert('업체 템플릿이 없습니다!')
      }
    },
    order_complete (event) {
      var btn = event.target.previousElementSibling
      btn.className = 'btn btn-danger'
    },
    product_dataUpload (e) {
      var rABS = true
      var files = e.target.files
      var f = files[0]
      var reader = new FileReader()
      reader.onload = (e) => {
        var data = e.target.result
        // var i
        if (!rABS) data = new Uint8Array(data)
        var workbook = xlsx.read(data, { type: rABS ? 'binary' : 'array', cellDates: true })
        var sheet = workbook.SheetNames[2]
        var json = xlsx.utils.sheet_to_json(workbook.Sheets[sheet])
        for (var i = 0; i < json.length; i++) {
          var now = new Date(json[i].date)
          // var now = new Date()
          var date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1))
          date = date.toISOString().slice(0, 10).replace(/-/g, '-')
          json[i].date = date
          // 2019-01-03 업데이트
          for (let v = 0; v < this.getproductData.length; v++) {
            for (let k = 0; k < this.getproductData[v].nongga_product.length; k++) {
              if (json[i].cw_code === this.getproductData[v].nongga_product[k].code) {
                json[i].product_option = this.getproductData[v].nongga_product[k].name
                json[i].product_code = this.getproductData[v].nongga_name
                json[i].gong_price = parseInt(this.getproductData[v].nongga_product[k].gongprice) * parseInt(json[i].cnt)
                if (json[i].delivery_pay === '0') {
                  if (!this.getproductData[v].nongga_product[k].deleveryCheck) {
                    json[i].pure_money = parseInt(json[i].jungsan_price) - parseInt(json[i].gong_price)
                  } else if (this.getproductData[v].nongga_product[k].deleveryCheck === 1) {
                    json[i].pure_money = parseInt(json[i].jungsan_price) - parseInt(json[i].gong_price) - 3000// parseInt(this.getProductData[v].nongga_product[k].deliveryPrice);
                  } else {
                    json[i].pure_money = parseInt(json[i].jungsan_price) - parseInt(json[i].gong_price)
                  }
                }
              }
            }
          }
          this.items.push(json[i])
        }
        this.product_json = json
      }
      if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f)
    },
    sumPojang () {
      if (this.items) {
        var a = this.items.reduce(function (accumulator, current, index) {
          if (checkIfAlreadyExist(current)) {
            var findIndex = accumulator.findIndex((element) => {
              return element.product_code === current.product_code && element.su === current.su && element.address === current.address
            })
            accumulator[findIndex].product_name = `${accumulator[findIndex].product_name} / ${current.product_name} - ${current.cnt}개`
            accumulator[findIndex].gong_price = accumulator[findIndex].gong_price + current.gong_price
            return accumulator
          } else {
            current.product_name = `${current.product_name} - ${current.cnt}개`
            return accumulator.concat([current])
          }

          function checkIfAlreadyExist (currentVal) {
            return accumulator.some((item) => {
              return (item.product_code === currentVal.product_code && item.su === currentVal.su && item.address === currentVal.address)
            })
          }
        }, [])
        this.items = a
      }
    },
    getList (code) {
      this.orderTypes = []
      this.companyEmail = ''
      this.deliveryEmail = ''
      this.kakaoTalk = ''
      this.sms = ''
      this.selected_code = code
      if (this.sum_table === 'not_accepted') {
        this.items = []
      }

      // TODO: 여기서는 items에 product_name을 바꿔서 items 완성
      for (var s = 0; s < this.getOrderData.length; s++) {
        if (this.selected_code === this.getOrderData[s].product_code) {
          if (this.getOrderData[s].product_option) {
            this.getOrderData[s].product_name = this.getOrderData[s].product_option
          }
          console.log(this.getOrderData[s])
          this.items.push(this.getOrderData[s])
        }
      }
      // TODO: 템플릿 적용하는 부분
      for (let i = 0; i < this.getproductData.length; i++) {
        if (this.getproductData[i].nongga_name === code) {
          if (this.getproductData[i].order_type) {
            const orderType = JSON.parse(this.getproductData[i].order_type)
            for (let i = 0; i < orderType.length; i++) {
              let key = Object.keys(orderType[i])[0]
              this.orderTypes.push(key)
              this[key] = orderType[i][key]
            }
          }
          let template = JSON.parse(this.getproductData[i].template)
          this.customTemplate = template
        }
      }
      if (this.customTemplate) {
        var a = this.customTemplate.reduce(function (accumulator, current, index) {
          if (checkIfAlreadyExist(current)) {
            current.dup = index
            return accumulator.concat([current])
          } else {
            return accumulator.concat([current])
          }

          function checkIfAlreadyExist (currentVal) {
            return accumulator.some((item) => {
              return (item.value === currentVal.value)
            })
          }
        }, [])

        let result = a.map((item, index) => {
          let json = {}
          if (item.dup) {
            json.key = `a${item.dup}`
            json.label = item.text
            json.thClass = 'bth'
            json.tdclass = 'btd'
          } else {
            json.key = item.value
            json.label = item.text
            json.thClass = 'bth'
            json.tdclass = 'btd'
          }
          for (let k = 0; k < this.items.length; k++) {
            if (this.items[k][json.key] === undefined) {
              this.items[k][json.key] = item.value
            }
            if (this.items[k][json.key] === '0') {
              this.items[k][json.key] = ''
            }
          }
          return json
        })
        this.fields = result
      } else {
        this.fields = [
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
        ]
      }
    },
    /*
    getList (code) {
      this.orderTypes = []
      this.companyEmail = ''
      this.deliveryEmail = ''
      this.kakaoTalk = ''
      this.sms = ''
      this.selected_code = code
      if (this.sum_table === 'not_accepted') {
        this.items = []
      }
      for (var s = 0; s < this.getOrderData.length; s++) {
        if (this.selected_code === this.getOrderData[s].product_code) {
          console.log(this.getOrderData[s])
          if (this.getOrderData[s].product_option) {
            this.getOrderData[s].product_name = this.getOrderData[s].product_option
          }
          this.items.push(this.getOrderData[s])
        }
      }

      for (let i = 0; i < this.getproductData.length; i++) {
        if (this.getproductData[i].nongga_name === code) {
          if (this.getproductData[i].order_type) {
            const orderType = JSON.parse(this.getproductData[i].order_type)
            for (let i = 0; i < orderType.length; i++) {
              let key = Object.keys(orderType[i])[0]
              this.orderTypes.push(key)
              this[key] = orderType[i][key]
            }
          }
          let template = JSON.parse(this.getproductData[i].template)
          this.customTemplate = template
          if (template) {
            var a = template.reduce(function (accumulator, current, index) {
              if (checkIfAlreadyExist(current)) {
                current.dup = index
                return accumulator.concat([current])
              } else {
                return accumulator.concat([current])
              }

              function checkIfAlreadyExist (currentVal) {
                return accumulator.some((item) => {
                  return (item.value === currentVal.value)
                })
              }
            }, [])
            let result = a.map((item, index) => {
              let json = {}
              if (item.dup) {
                json.key = `a${item.dup}`
                json.label = item.text
                json.thClass = 'bth'
                json.tdclass = 'btd'
                for (let k = 0; k < this.items.length; k++) {
                  if (!this.items[k][json.key]) {
                    this.items[k][json.key] = item.value
                  }
                }
              } else {
                json.key = item.value
                json.label = item.text
                json.thClass = 'bth'
                json.tdclass = 'btd'
                for (let k = 0; k < this.items.length; k++) {
                  console.log(this.items[k][json.key])
                  if (!this.items[k][json.key]) {
                    this.items[k][json.key] = item.value
                  }
                }
              }
              return json
            })
            this.fields = result
          } else {
            this.fields = [
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
            ]
          }
        }
      }
    },
*/
    saveToExcel () {
      var worksheet = xlsx.utils.table_to_book(document.getElementById('bb_list_table'))
      var opts = { bookType: 'xlsx', bookSST: false, type: 'binary' }
      var wbout = xlsx.write(worksheet, opts)
      fileSaver.saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), this.selected_code + '_' + this.order_day + '.xlsx')
    },
    s2ab (s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.order{padding:0 20px}
.com_code{margin:24px 0}
.list_table{table-layout: auto;margin-top:30px}
.bal_btns{display:inline-block;margin:10px}
.bth{word-break:keep-all;text-align: center;text-align:center!important; background-color:greenyellow!important;}
.btd{text-overflow: ellipsis;overflow:hidden;white-space:nowrap}
.date_input_width{width:110px!important}
</style>
