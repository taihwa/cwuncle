<template>
  <div class="deliveryNum">
    <h1>송장넣기</h1>
    <b-row>
      <b-col>
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
      <b-col>
        <b-btn variant="success" @click="ac_getOrderData(order_day)">검색</b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card title="플랫폼별 전체다운 받기" class="com_code">
        <span v-for='(platform, index) in allUniqPlatform' class="bal_btns" :key="index">
          <b-button variant="outline-warning" @click='getPlatformAllList(platform)'>{{platform}}</b-button>
          <b-button @click="order_complete">x</b-button>
        </span>
        </b-card>
      </b-col>
    </b-row>
    <b-card title="업체명" class="com_code">
    <span v-for='(uniq, index) in getUniqCode' class="bal_btns" :key="index">
      <b-button variant="outline-warning" v-on:click='getList(uniq)'>{{uniq}}</b-button>
      <b-button @click="order_complete">x</b-button>
    </span>
    </b-card>
    <b-row>
      <b-col cols="1">
        <b-btn variant="warning" @click="selectAllRows">전체선택</b-btn>
      </b-col>
      <b-col cols="3">
        <b-form-select
          v-model="deliveryCompany"
          :options = "deliveryCompanys"
        ></b-form-select>
      </b-col>
      <b-col cols="3">
        <b-btn variant="info" @click="deliveryConfirm">적용</b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="3" class="mt-3">
        <b-button variant="success" v-on:click="ac_songjangUpdateData(selectedRows)">저장하기</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card title="플랫폼별 다운 받기" class="com_code">
        <span v-for='(platform, index) in getUniqPlatforms' class="bal_btns" :key="index">
          <b-button variant="outline-warning" @click='getPlatformList(platform)'>{{platform}}</b-button>
          <b-button @click="order_complete">x</b-button>
        </span>
        </b-card>
      </b-col>
    </b-row>
    <b-table
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
      <template v-slot:cell(delivery_num) = "data">
        <b-form-input v-model="data.item.delivery_num" class="date_input_width"></b-form-input>
      </template>
    </b-table>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import fileSaver from 'file-saver'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Order',
  data () {
    return {
      getUniqPlatforms: [],
      deliveryCompany: '',
      deliveryCompanys: [
        'CJ대한통운',
        '우체국택배',
        '한진택배',
        '로젠택배',
        '롯데택배',
        '합동택배',
        '경동택배'
      ],
      selected: null,
      complete: 'outline-warning',
      fields: [
        { key: 'chk', label: '' },
        { key: 'platform', label: '플랫폼', thClass: 'bth', tdClass: 'btd' },
        { key: 'jumun_number', label: '주문번호', thClass: 'bth', tdClass: 'btd' },
        { key: 'delivery_company', label: '택배사', thClass: 'bth', tdClass: 'btd' },
        { key: 'delivery_num', label: '송장번호', thClass: 'bth', tdClass: 'btd' },
        { key: 'su', label: '수취인', thClass: 'bth', tdClass: 'btd' },
        { key: 'address', label: '주소', thClass: 'bth', tdClass: 'btd' },
        { key: 'product_name', label: '상품명', thClass: 'bth', tdClass: 'btd' },
        { key: 'cnt', label: '수량', thClass: 'bth', tdClass: 'btd' },
        { key: 'message', label: '메세지', thClass: 'bth', tdClass: 'btd' },
        { key: 'num', label: '넘버', thClass: 'bth', tdClass: 'btd' }
      ],
      items: [],
      order_day: null,
      uniqProduct_code: [],
      selected_code: null,
      product_json: null,
      selectedDate: '',
      selectedRows: [],
      naverFields: [
        { key: 'jumun_number', label: '상품주문번호', thClass: 'bth', tdClass: 'btd' },
        { key: 'delivery_method', label: '배송방법', thClass: 'bth', tdClass: 'btd' },
        { key: 'delivery_company', label: '택배사', thClass: 'bth', tdClass: 'btd' },
        { key: 'delivery_num', label: '송장번호', thClass: 'bth', tdClass: 'btd' }
      ]
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
    allUniqPlatform () {
      let uniqPlatform = []
      if (this.getOrderData) {
        uniqPlatform = this.getOrderData.reduce((acc, cur) => {
          if (checkIfAlreadyExist(cur)) {
            return acc
          } else {
            return acc.concat([cur.platform])
          }
          function checkIfAlreadyExist (cur) {
            return acc.some((item) => {
              return (item === cur.platform)
            })
          }
        }, [])
      }
      return uniqPlatform
    }
  },
  methods: {
    ...mapActions([
      'ac_productDataUpload',
      'ac_getOrderData',
      'ac_songjangUpdateData',
      'ac_getProductData'
    ]),
    naver (arr) {
      return arr.reduce((acc, cur) => {
        if (cur.platform === '네이버') {
          acc.push({
            '상품주문번호': cur.jumun_number,
            '배송방법': '택배,등기,소포',
            '택배사': cur.delivery_company,
            '송장번호': cur.delivery_num
          })
        }
        return acc
      }, [])
    },
    auction (arr) {
      return arr.reduce((acc, cur) => {
        if (cur.delivery_company === 'CJ대한통운') {
          cur.delivery_company = 'CJ택배'
        }
        if (cur.platform === '옥션') {
          acc.push({
            '계정': 'cwuncle',
            '주문번호': cur.jumun_number,
            '택배사': cur.delivery_company,
            '송장번호': cur.delivery_num
          })
        }
        return acc
      }, [])
    },
    coupang (arr) {
      return arr.reduce((acc, cur) => {
        if (cur.delivery_company === 'CJ대한통운') cur.delivery_company = 'CJ 대한통운'
        if (cur.delivery_company === '우체국택배') cur.delivery_company = '우체국'
        if (cur.platform === '쿠팡') {
          acc.push({
            '번호': '1',
            '묶음배송번호': '',
            '주문번호': cur.jumun_number,
            '택배사': cur.delivery_company,
            '송장번호': cur.delivery_num
          })
        }
        return acc
      }, [])
    },
    talk (arr) {
      return arr.reduce((acc, cur) => {
        if (cur.delivery_company === 'CJ대한통운') cur.delivery_company = 2
        if (cur.delivery_company === '로젠택배') cur.delivery_company = 4
        if (cur.delivery_company === '한진택배') cur.delivery_company = 8
        if (cur.delivery_company === '롯데택배') cur.delivery_company = 9
        if (cur.delivery_company === '우체국택배') cur.delivery_company = 6
        if (cur.delivery_company === '합동택배') cur.delivery_company = 14
        if (cur.delivery_company === '경동택배') cur.delivery_company = 15
        if (cur.platform === '톡스토어') {
          acc.push({
            '주문번호': cur.jumun_number,
            '배송방법': '택배',
            '택배사코드': cur.delivery_company,
            '송장번호': cur.delivery_num,
            '수령인명': cur.su
          })
        }
        return acc
      }, [])
    },
    hns (arr) {
      return arr.reduce((acc, cur) => {
        if (cur.platform === '홈앤쇼핑') {
          acc.push({
            '주문번호': cur.jumun_number,
            '송장번호': cur.delivery_num
          })
        }
        return acc
      }, [])
    },
    kshop (arr) {
      return arr.reduce((acc, cur) => {
        if (cur.platform === 'k쇼핑') {
          acc.push({
            '상품주문번호': cur.jumun_number,
            '배송방법': '택배,등기,소포',
            '택배사': cur.delivery_company,
            '송장번호': cur.delivery_num
          })
        }
        return acc
      }, [])
    },
    getPlatformList (platform) {
      if (platform === '네이버') {
        let json = this.naver(this.items)
        this.jsonToExcel(json, 'xls', platform, '발송처리')
      }
      if (platform === '옥션') {
        let json = this.auction(this.items)
        this.jsonToExcel(json, 'xls', platform, 'Sheet1')
      }
      if (platform === '쿠팡') {
        let json = this.coupang(this.items)
        this.jsonToExcel(json, 'xlsx', platform, 'Sheet1')
      }
      if (platform === '톡스토어') {
        let json = this.talk(this.items)
        this.jsonToExcel(json, 'xlsx', platform, 'Sheet0')
      }
      if (platform === '홈앤쇼핑') {
        let json = this.hns(this.items)
        this.jsonToExcel(json, 'xlsx', platform, 'Sheet1')
      }
      if (platform === 'K쇼핑') {
        let json = this.kshop(this.items)
        this.jsonToExcel(json, 'xlsx', platform, 'Sheet1')
      }
    },
    getPlatformAllList (platform) {
      const arr = this.getOrderData.reduce((acc, cur) => {
        if (cur.platform === platform) {
          acc.push(cur)
        }
        return acc
      }, [])
      if (platform === '네이버') {
        let json = this.naver(arr)
        this.jsonToExcel(json, 'xls', platform, '발송처리')
      }
      if (platform === '옥션') {
        let json = this.auction(arr)
        this.jsonToExcel(json, 'xls', platform, 'Sheet1')
      }
      if (platform === '쿠팡') {
        let json = this.coupang(arr)
        this.jsonToExcel(json, 'xlsx', platform, 'Sheet1')
      }
      if (platform === '톡스토어') {
        let json = this.talk(arr)
        this.jsonToExcel(json, 'xlsx', platform, 'Sheet1')
      }
      if (platform === '홈앤쇼핑') {
        let json = this.hns(arr)
        this.jsonToExcel(json, 'xlsx', platform, 'Sheet1')
      }
      if (platform === 'K쇼핑') {
        let json = this.kshop(arr)
        this.jsonToExcel(json, 'xlsx', platform, 'Sheet1')
      }
    },
    jsonToExcel (json, type, platform, sheetName) {
      const now = new Date()
      let date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
      date = date.toISOString().slice(0, 10).replace(/-/g, '-')
      let workbook = xlsx.utils.book_new()
      let worksheet = xlsx.utils.json_to_sheet(json)
      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName)
      // var opts = { bookType: bookType, bookSST: false, type: 'binary' }
      var opts = { bookSST: false, type: 'binary' }
      let wbout = xlsx.write(workbook, opts)
      fileSaver.saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), `${platform}송장_${date} + .${type}`)
    },
    deliveryConfirm () {
      this.items = this.items.map((item) => {
        item.delivery_company = this.deliveryCompany
        return item
      })
    },
    onRowSelected (items) {
      this.selectedRows = items
    },
    selectAllRows () {
      this.$refs.bb_list_table.selectAllRows()
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
    getList (code) {
      this.items = []
      this.getUniqPlatforms = []
      let platformArray = []
      // TODO: 여기서는 items에 product_name을 바꿔서 items 완성
      for (var s = 0; s < this.getOrderData.length; s++) {
        if (code === this.getOrderData[s].product_code) {
          if (this.getOrderData[s].product_option) {
            this.getOrderData[s].product_name = this.getOrderData[s].product_option
            platformArray.push(this.getOrderData[s].platform)
          }
          this.items.push(this.getOrderData[s])
        }
      }
      this.getUniqPlatforms = platformArray.sort().reduce((accumulator, current) => {
        const length = accumulator.length
        if (length === 0 || accumulator[length - 1] !== current) {
          accumulator.push(current)
        }
        return accumulator
      }, [])
    },
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
.date_input_width{width:150px!important}
</style>
