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
        <b-button variant="outline-success" @click="getSearch()">검색</b-button>
      </b-col>
    </b-row>
    <b-row class="mb-4">
      <b-col cols="2">
        <b-card
          border-variant="secondary"
          header="매출액"
          header-border-variant="secondary"
          align="center"
        >
          <b-card-text>{{sumSellPrice}}</b-card-text>
        </b-card>
      </b-col>
      <b-col cols="2">
        <b-card
          border-variant="secondary"
          header="순수익"
          header-border-variant="secondary"
          align="center"
        >
          <b-card-text>{{sumPurePrice}}</b-card-text>
        </b-card>
      </b-col>
      <b-col cols="8">
        <b-table-simple hover small caption-top responsive>
          <b-thead>
            <b-tr class="text-center">
              <b-th>총 주문수</b-th>
              <b-th>네이버</b-th>
              <b-th>ESM</b-th>
              <b-th>톡스토어</b-th>
              <b-th>11번가</b-th>
              <b-th>K쇼핑</b-th>
              <b-th>홈앤쇼핑</b-th>
              <b-th>위메프</b-th>
              <b-th>쿠팡</b-th>
              <b-th>자갈치쇼핑몰</b-th>
              <b-th>티몬</b-th>
              <b-th>네이버페이</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr class="text-center">
              <b-th>{{allCnt}}</b-th>
              <b-th>{{naverCnt}}</b-th>
              <b-td>{{esmCnt}}</b-td>
              <b-td>{{talkCnt}}</b-td>
              <b-td>{{elevenCnt}}</b-td>
              <b-td>{{kshopCnt}}</b-td>
              <b-td>{{hnsCnt}}</b-td>
              <b-td>{{weCnt}}</b-td>
              <b-td>{{coupangCnt}}</b-td>
              <b-td>{{jagalCnt}}</b-td>
              <b-td>{{tmonCnt}}</b-td>
              <b-td>{{naverPayCnt}}</b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-col>
    </b-row>
    <b-table
      :fields="fields"
      :items="items"
    >
      <template v-slot:cell(show_details) = "row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? '닫기' : '수정'}}
        </b-button>
      </template>
      <template v-slot:row-details="row">
        <b-card>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>상품코드:</b></b-col>
            <b-col>
              <b-form-input type="text" v-model="row.item.cw_code"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>공급가:</b></b-col>
            <b-col>
              <b-form-input type="number" v-model="row.item.gong_price"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>판매가:</b></b-col>
            <b-col>
              <b-form-input type="number" v-model="row.item.sell_price"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>정산금액</b></b-col>
            <b-col>
              <b-form-input type="number" v-model="row.item.jungsan_price"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>순이익:</b></b-col>
            <b-col>
              <b-form-input type="number" v-model="row.item.pure_money"></b-form-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-button variant="success" @click="updatePrice(row.item)">수정하기</b-button>
            </b-col>
          </b-row>
        </b-card>
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
      allCnt: 0,
      naverCnt: 0,
      esmCnt: 0,
      talkCnt: 0,
      elevenCnt: 0,
      kshopCnt: 0,
      hnsCnt: 0,
      weCnt: 0,
      coupangCnt: 0,
      jagalCnt: 0,
      tmonCnt: 0,
      naverPayCnt: 0,
      items: [],
      searchs: {
        text: '',
        searchSelected: 'su',
        date1: '',
        date2: ''
      },
      fields: [
        { key: 'show_details', label: '', thClass: 'btn', tdClass: 'btd' },
        { key: 'num1', label: '숫자', thClass: 'bth', tdClass: 'btd' },
        { key: 'cancle', label: '취소/환불', thClass: 'bth', tdClass: 'btd' },
        { key: 'date', label: '날짜', thClass: 'bth', tdClass: 'btd' },
        { key: 'platform', label: '플랫폼', thClass: 'bth', tdClass: 'btd' },
        { key: 'product_code', label: '상점명', thClass: 'bth', tdClass: 'btd' },
        { key: 'cw_code', label: '상품코드', thClass: 'bth', tdClass: 'btd' },
        { key: 'product_option', label: '상품명', thClass: 'bth', tdClass: 'btd' },
        { key: 'cnt', label: '수량', thClass: 'bth', tdClass: 'btd' },
        { key: 'gong_price', label: '공급가', thClass: 'bth', tdClass: 'btd' },
        { key: 'sell_price', label: '판매가', thClass: 'bth', tdClass: 'btd' },
        { key: 'jungsan_price', label: '정산금액', thClass: 'bth', tdClass: 'btd' },
        { key: 'pure_money', label: '순이익', thClass: 'bth', tdClass: 'btd' },
        { key: 'platformDelivery', label: '구분', thClass: 'bth', tdClass: 'btd' },
        { key: 'deliveryPay', label: '배송비', thClass: 'bth', tdClass: 'btd' },
        { key: 'num', label: '넘버', thClass: 'bth', tdClass: 'btd' }
      ]
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
    this.ac_getProductData()
  },
  computed: {
    ...mapGetters([
      'getproductData'
    ]),
    sumPurePrice () {
      let result = 0
      if (this.items) {
        result = this.items.reduce((acc, cur, index) => {
          if (!isNaN(cur.pure_money)) {
            return acc + parseInt(cur.pure_money)
          } else {
            return acc + 0
          }
        }, 0)
        result = result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      return result
    },
    sumSellPrice () {
      let result = 0
      if (this.items) {
        result = this.items.reduce((acc, cur, index) => {
          if (!isNaN(cur.sell_price)) {
            return acc + parseInt(cur.sell_price)
          } else {
            return acc + 0
          }
        }, 0)
        result = result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      return result
    }
  },
  methods: {
    ...mapActions([
      'ac_getDateData',
      'ac_getProductData',
      'ac_updateData'
    ]),
    async updatePrice (item) {
      let moneyData = {}
      moneyData.num = item.num
      moneyData.cw_code = item.cw_code
      moneyData.gong_price = item.gong_price
      moneyData.jungsan_price = item.jungsan_price
      moneyData.pure_money = item.pure_money
      moneyData.sell_price = item.sell_price
      this.ac_updateData(moneyData)
    },
    async getSearch () {
      this.allCnt = 0
      this.naverCnt = 0
      this.esmCnt = 0
      this.coupangCnt = 0
      this.elevenCnt = 0
      this.kshopCnt = 0
      this.hnsCnt = 0
      this.talkCnt = 0
      this.weCnt = 0
      this.tmonCnt = 0
      this.jagalCnt = 0
      this.naverPayCnt = 0
      
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      const result = await Axios.get('https://bagcw.com/jumun/' + this.searchs.date1 + '/' + this.searchs.date2)
      if (result.data.length > 0) {
        this.items = result.data.map((item, index) => {
          let nongga = this.getproductData.filter(nongga => nongga.nongga_name === item.product_code)
          let code = nongga[0].nongga_product.filter(product => product.code === item.cw_code)
          item.num1 = index + 1
          this.allCnt += 1
          if (code[0] !== undefined) {
            item.platformDelivery = this.getPlatformDelivery(item, code[0])
            item.deliveryPay = code[0].deliveryPrice
          } else {
            item.deliveryPay = '확인불가'
          }
          item.pure_money = this.getPurePrice(item, code)
          let now = new Date(item.date)
          let date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
          item.date = date.toISOString().slice(0, 10).replace(/-/g, '-')
          return item
        })
      } else {
        alert('찾지 못함')
      }
    },
    getPurePrice (item, code) {
      if (item.platformDelivery === '무료') {
        return parseInt(item.jungsan_price) - parseInt(item.gong_price) - parseInt(item.deliveryPay)
      } else if (item.platformDelivery === '유료') {
        return parseInt(item.jungsan_price) - parseInt(item.gong_price)
      } else {
        return 0
      }
    },
    getPlatformDelivery (item, code) {
      if (item.platform === '네이버') {
        this.naverCnt += 1
        if (code.naverPay !== undefined) {
          return code.naverPay
        } else {
          return 0
        }
      }
      if (item.platform === '옥션') {
        this.esmCnt += 1
        if (code.auctionPay !== undefined) {
          return code.auctionPay
        } else {
          return 0
        }
      }
      if (item.platform === '쿠팡') {
        this.coupangCnt += 1
        if (code.coupangPay !== undefined) {
          return code.coupangPay
        } else {
          return 0
        }
      }
      if (item.platform === '11번가') {
        this.elevenCnt += 1
        if (code.elevenPay !== undefined) {
          return code.elevenPay
        } else {
          return 0
        }
      }
      if (item.platform === 'k쇼핑') {
        this.kshopCnt += 1
        if (code.kshopPay !== undefined) {
          return code.kshopPay
        } else {
          return 0
        }
      }
      if (item.platform === '홈앤쇼핑') {
        this.hnsCnt += 1
        if (code.hnsPay !== undefined) {
          return code.hnsPay
        } else {
          return 0
        }
      }
      if (item.platform === '톡스토어') {
        this.talkCnt += 1
        if (code.talkPay !== undefined) {
          return code.talkPay
        } else {
          return 0
        }
      }
      if (item.platform === '위메프2') {
        this.weCnt += 1
        if (code.wemarketPay !== undefined) {
          return code.wemarketPay
        } else {
          return 0
        }
      }
      if (item.platform === '티몬') {
        this.tmonCnt += 1
      }
      if (item.platform === '자갈치쇼핑몰') {
        this.jagalCnt += 1
      }
      if (item.platform === '네이버페이') {
        this.naverPayCnt += 1
      }
      return 0
    }
  }
}
</script>
<style>
.bth{word-break:keep-all;text-align: center;text-align:center!important; background-color:greenyellow!important;}
.btd{text-overflow: ellipsis;overflow:hidden;white-space:nowrap;text-align:center!important}
</style>
