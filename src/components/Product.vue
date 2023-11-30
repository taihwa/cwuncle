<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12">
          <h2>
            상품관리
            <b-button @click="createRow" variant="success">(업체추가)</b-button>
          </h2>
          <b-table striped hover :items="getproductData" :fields="fields">
            <template v-slot:cell(actions)="row">
              <b-button size="sm" @click.stop="updateRow(row.item, row.index, $event.target)" class="mr-1">
                수정하기
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>
    <!-- 상품 등록 -->
    <b-modal ref="create_modalInfo" @hide="resetModal" title="농가 추가하기" @ok="addCompany(modalInfo.content,productInputs)">
      <b-row class="my-1">
        <b-col sm="3"><label>아이디</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.uid"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>임시비밀번호</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.pw"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>농가명</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.nongga_name"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>대표자명</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.nongga_ceo"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>연락처</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.nongga_phone"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>사업자등록번호</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.nongga_num"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>조건부 무료 금액</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.conditinal_free"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>발주 방법</label></b-col>
        <b-col sm="9">
          <b-form-group >
            <b-form-checkbox-group
              id="checkbox-group-1"
              v-model="orderTypes"
              name="flavour-1"
            >
              <b-row class="mb-3">
                <b-col>
                  <b-form-checkbox value="companyEmail">업체 이메일</b-form-checkbox>
                  <b-form-input type="email" v-model="companyEmail" placeholder="이메일"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="mb-3">
                <b-col>
                  <b-form-checkbox value="deliveryEmail">택배사 이메일</b-form-checkbox>
                  <b-form-input type="email" v-model="deliveryEmail" placeholder="이메일"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="mb-3">
                <b-col>
                  <b-form-checkbox value="kakaoTalk">카카오톡</b-form-checkbox>
                  <b-form-input type="text" v-model="kakaoTalk" placeholder="연락처"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="mb-3">
                <b-col>
                  <b-form-checkbox value="sms">문자</b-form-checkbox>
                  <b-form-input type="text" v-model="sms" placeholder="연락처"></b-form-input>
                </b-col>
              </b-row>
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="my-1">
        상품
      </b-row>
      <b-row class="my-1">
        <b-btn variant="success" @click="addProduct(productIndex)">추가+</b-btn>
      </b-row>
      <div v-for="(productInput, index) in productInputs" :key="index">
        <b-row class="my-1">
          <b-col sm="3"><label>&nbsp;</label></b-col>
          <b-col sm="9"><b-btn @click="removeProductInput(index)" variant="danger">-</b-btn></b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="3"><label>상품코드</label></b-col>
          <b-col sm="6"><b-form-input type="text" v-model="productInput.code"></b-form-input></b-col>
          <b-col sm="3"><b-btn @click="createId(index)">생성</b-btn></b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="3"><label>상품이름</label></b-col>
          <b-col sm="9"><b-form-input type="text" v-model="productInput.name"></b-form-input></b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="3"><label>공급가</label></b-col>
          <b-col sm="9"><b-form-input type="text" v-model="productInput.gongprice"></b-form-input></b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="3"><label>판매가 택비 포함</label></b-col>
          <b-col sm="9">
              <b-form-radio-group
                id="btn-radios-2"
                v-model="productInput.deleveryCheck"
                :options="options"
                buttons
                button-variant="outline-primary"
                size="lg"
                name="radio-btn-outline"
              ></b-form-radio-group>
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="3"><label>택배비</label></b-col>
          <b-col sm="9"><b-form-input type="text" v-model="productInput.deliveryPrice"></b-form-input></b-col>
        </b-row>
      </div>
    </b-modal>

    <!-- 상품 수정 -->
    <b-modal id="update_modalInfo" size="xl" @hide="resetModal" title="농가 추가하기" @ok="updateCompany(modalInfo.content,productInputs)">
      <b-row class="my-1">
        <b-col sm="3"><label>아이디</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.uid"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>임시비밀번호</label></b-col>
        <b-col sm="9"><input type="password" class="form-control" v-model="modalInfo.content.pw"></b-col>
      </b-row>

      <b-row class="my-1">
        <b-col sm="9"><b-btn @click='ac_changePartnerInfo({uid:modalInfo.content.uid,pw:modalInfo.content.pw,num:modalInfo.content.num})'>변경하기</b-btn></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>대표자 사인</label></b-col>
        <b-col sm="6"><input type="file" class="form-control" @change="getSign($event)"></b-col>
        <b-col sm="3"><b-img :src="modalInfo.content.signImg"></b-img></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>농가명</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.nongga_name"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>대표자명</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.nongga_ceo"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>연락처</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.nongga_phone"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>사업자등록번호</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.nongga_num"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>조건부 무료 금액</label></b-col>
        <b-col sm="9"><input type="text" class="form-control" v-model="modalInfo.content.conditinal_free"></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3"><label>발주 방법</label></b-col>
        <b-col sm="9">
          <b-form-group >
            <b-form-checkbox-group
              id="checkbox-group-1"
              v-model="orderTypes"
              name="flavour-1"
              @change="orderTypeCheck($event)"
            >
              <b-row class="mb-3">
                <b-col>
                  <b-form-checkbox value="companyEmail">업체 이메일</b-form-checkbox>
                  <b-form-input type="email" v-model="companyEmail" placeholder="이메일"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="mb-3">
                <b-col>
                  <b-form-checkbox value="deliveryEmail">택배사 이메일</b-form-checkbox>
                  <b-form-input type="email" v-model="deliveryEmail" placeholder="이메일"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="mb-3">
                <b-col>
                  <b-form-checkbox value="kakaoTalk">카카오톡</b-form-checkbox>
                  <b-form-input type="text" v-model="kakaoTalk" placeholder="연락처"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="mb-3">
                <b-col>
                  <b-form-checkbox value="sms">문자</b-form-checkbox>
                  <b-form-input type="text" v-model="sms" placeholder="연락처"></b-form-input>
                </b-col>
              </b-row>
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="5"><b-btn variant="warning" @click="updateNong(modalInfo.content)">수정</b-btn></b-col>
        <b-col sm="5"><b-btn variant="danger" @click="deleteNong(modalInfo.content.num)">삭제</b-btn></b-col>
      </b-row>
      <b-row class="my-1">
        상품
      </b-row>
      <b-row class="my-1">
        <b-btn variant="success" @click="addProduct(productIndex)">추가+</b-btn>
      </b-row>
      <b-table id="productTable" v-sortable="sortableOptions" :items="productInputs" :fields="fields1" striped responsive="sm">
        <template v-slot:cell(deleteItem)="row">
          <b-btn @click="removeProductInput(row.index)" variant="danger">-</b-btn>
        </template>
        <template v-slot:cell(code)="row">
          <b-form-input type="text" v-model="row.item.code" :disabled="row.item.code!=''"></b-form-input>
          <b-btn v-if="row.item.code===''" @click="createId(row.index)">생성</b-btn>
        </template>
        <template v-slot:cell(name)="row">
          <b-form-input type="text" v-model="row.item.name"></b-form-input>
        </template>
        <template v-slot:cell(gongprice)="row">
          <b-form-input type="text" v-model="row.item.gongprice"></b-form-input>
        </template>
        <template v-slot:cell(deleveryCheck)="row">
          <b-form-radio-group
            id="btn-radios-2"
            v-model="row.item.deleveryCheck"
            :options="options"
            buttons
            button-variant="outline-primary"
            size="lg"
            name="radio-btn-outline"
          ></b-form-radio-group>
        </template>
        <template v-slot:cell(deliveryPrice)="row">
          <b-form-input type="text" v-model="row.item.deliveryPrice"></b-form-input>
        </template>
        <template v-slot:cell(show_details)="row">
          <b-button size="sm" @click="row.toggleDetails" class="mr-2">
            {{ row.detailsShowing ? '닫기' : '보기'}}
          </b-button>
        </template>
        <template v-slot:row-details="row">
          <b-card>
            <b-row class="my-1 mb-3 text-center" style="margin-bottom:50px">
              <b-col sm="2" class="text-info">
                플랫폼
              </b-col>
              <b-col sm="3" class="text-info">
                쇼핑몰코드
              </b-col>
              <b-col sm="3" class="text-info">
                쇼핑몰 배송비
              </b-col>
              <b-col sm="4" class="text-info">
                판매여부
              </b-col>
            </b-row>
            <b-row class="my-1 text-center">
              <b-col sm="2">
                <label>네이버</label>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="코드" v-model="row.item.naverCode"></b-form-input>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="배송비" v-model="row.item.naverPay"></b-form-input>
              </b-col>
              <b-col sm="4">
                <b-select placeholder="판매여부" v-model="row.item.naverStatus">
                  <b-select-option value="on">판매중</b-select-option>
                  <b-select-option value="off">판매중지</b-select-option>
                </b-select>
              </b-col>
            </b-row>
            <b-row class="my-1 text-center">
              <b-col sm="2">
                <label>쿠팡</label>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="코드" v-model="row.item.coupangCode"></b-form-input>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="배송비" v-model="row.item.coupangPay"></b-form-input>
              </b-col>
              <b-col sm="4">
                <b-select placeholder="판매여부" v-model="row.item.coupangStatus">
                  <b-select-option value="on">판매중</b-select-option>
                  <b-select-option value="off">판매중지</b-select-option>
                </b-select>
              </b-col>
            </b-row>
            <b-row class="my-1 text-center">
              <b-col sm="2">
                <label>톡스토어</label>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="코드" v-model="row.item.talkCode"></b-form-input>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="배송비" v-model="row.item.talkPay"></b-form-input>
              </b-col>
              <b-col sm="4">
                <b-select placeholder="판매여부" v-model="row.item.talkStatus">
                  <b-select-option value="on">판매중</b-select-option>
                  <b-select-option value="off">판매중지</b-select-option>
                </b-select>
              </b-col>
            </b-row>
            <b-row class="my-1 text-center">
              <b-col sm="2">
                <label>11번가</label>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="코드" v-model="row.item.elevenCode"></b-form-input>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="배송비" v-model="row.item.elevenPay"></b-form-input>
              </b-col>
              <b-col sm="4">
                <b-select placeholder="판매여부" v-model="row.item.elevenStatus">
                  <b-select-option value="on">판매중</b-select-option>
                  <b-select-option value="off">판매중지</b-select-option>
                </b-select>
              </b-col>
            </b-row>
            <b-row class="my-1 text-center">
              <b-col sm="2">
                <label>옥션</label>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="코드" v-model="row.item.auctionCode"></b-form-input>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="배송비" v-model="row.item.auctionPay"></b-form-input>
              </b-col>
              <b-col sm="4">
                <b-select placeholder="판매여부" v-model="row.item.auctionStatus">
                  <b-select-option value="on">판매중</b-select-option>
                  <b-select-option value="off">판매중지</b-select-option>
                </b-select>
              </b-col>
            </b-row>
            <b-row class="my-1 text-center">
              <b-col sm="2">
                <label>지마켓</label>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="코드" v-model="row.item.gmarketCode"></b-form-input>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="배송비" v-model="row.item.gmarketPay"></b-form-input>
              </b-col>
              <b-col sm="4">
                <b-select placeholder="판매여부" v-model="row.item.gmarketStatus">
                  <b-select-option value="on">판매중</b-select-option>
                  <b-select-option value="off">판매중지</b-select-option>
                </b-select>
              </b-col>
            </b-row>
            <b-row class="my-1 text-center">
              <b-col sm="2">
                <label>위메프</label>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="코드" v-model="row.item.wemarketCode"></b-form-input>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="배송비" v-model="row.item.wemarketPay"></b-form-input>
              </b-col>
              <b-col sm="4">
                <b-select placeholder="판매여부" v-model="row.item.wemarketStatus">
                  <b-select-option value="on">판매중</b-select-option>
                  <b-select-option value="off">판매중지</b-select-option>
                </b-select>
              </b-col>
            </b-row>
            <b-row class="my-1 text-center">
              <b-col sm="2">
                <label>K쇼핑</label>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="코드" v-model="row.item.kshopCode"></b-form-input>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="배송비" v-model="row.item.kshopPay"></b-form-input>
              </b-col>
              <b-col sm="4">
                <b-select placeholder="판매여부" v-model="row.item.kshopStatus">
                  <b-select-option value="on">판매중</b-select-option>
                  <b-select-option value="off">판매중지</b-select-option>
                </b-select>
              </b-col>
            </b-row>
            <b-row class="my-1 text-center">
              <b-col sm="2">
                <label>홈앤쇼핑</label>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="코드" v-model="row.item.hnsCode"></b-form-input>
              </b-col>
              <b-col sm="3">
                <b-form-input type="text" placeholder="배송비" v-model="row.item.hnsPay"></b-form-input>
              </b-col>
              <b-col sm="4">
                <b-select placeholder="판매여부" v-model="row.item.hnsStatus">
                  <b-select-option value="on">판매중</b-select-option>
                  <b-select-option value="off">판매중지</b-select-option>
                </b-select>
              </b-col>
            </b-row>
          </b-card>
        </template>
      </b-table>
    </b-modal>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Axios from 'axios'
import Vue from 'vue'
import Sortable from 'sortablejs'
const createSortable = (el, options, vnode) => {
  return Sortable.create(el, {
    ...options
  })
}

const sortable = {
  name: 'sortable',
  bind (el, binding, vnode) {
    const table = el
    table._sortable = createSortable(table.querySelector('tbody'), binding.value, vnode)
  }
}
export default {
  directives: {
    sortable
  },
  data () {
    return {
      sortableOptions: {
        chosenClass: 'is-selected',
        onEnd: (evt) => {
          let tmp = this.productInputs[evt.oldIndex]
          this.productInputs[evt.oldIndex] = this.productInputs[evt.newIndex]
          this.productInputs[evt.newIndex] = tmp
        }
      },
      fields1: [
        { key: 'deleteItem', label: '삭제' },
        { key: 'code', label: '상품코드' },
        { key: 'name', label: '상품이름' },
        { key: 'gongprice', label: '공급가' },
        { key: 'deleveryCheck', label: '택비포함' },
        { key: 'deliveryPrice', label: '택배비' },
        { key: 'show_details', label: '등록현황' }
      ],
      orderTypes: [],
      companyEmail: '',
      deliveryEmail: '',
      kakaoTalk: '',
      sms: '',
      fields: [
        { key: 'actions', label: '수정' },
        { key: 'num', label: '번호' },
        { key: 'nongga_name', label: '업체명' },
        { key: 'nongga_ceo', label: '대표자명' },
        { key: 'nongga_phone', label: '연락처' },
        { key: 'nongga_num', label: '사업자등록번호' }
      ],
      modalInfo: {
        title: '',
        content: {
          nongga_name: '',
          nongga_num: '',
          nongga_ceo: '',
          nongga_phone: '',
          nongga_product: [],
          conditinal_free: ''
        }
      },
      produts: [],
      productInputs: [],
      productInput: {
        code: '',
        name: '',
        gongprice: '',
        deliveryPrice: ''
      },
      productIndex: '',
      product_id: '',
      options: [
        { text: '포함', value: 1 },
        { text: '미포함', value: 2 }
      ],
      signImg: ''
    }
  },
  computed: {
    ...mapGetters([
      'getproductData'
    ])
  },
  watch: {

  },
  created () {
    this.ac_getProductData()
  },
  methods: {
    ...mapActions([
      'ac_productInfoUpload',
      'ac_getProductData',
      'ac_updateProductData',
      'ac_changePartnerInfo'
    ]),
    async updateNong (data) {
      const { data: { success } } = await Axios.put('https://bagcw.com/product', data)
      if (success) {
        alert('변경 성공')
      } else {
        alert('실패')
      }
    },
    async deleteNong (id) {
      const result = await Axios.delete(`https://bagcw.com/product?key=${id}`)
      if (result) {
        if (result.data) {
          alert('삭제완료')
          this.ac_getProductData()
        }
      }
    },
    getSign (e) {
      let formData = new FormData()
      formData.append('imgfile', e.target.files[0])
      Axios.post('https://bagcw.com/product/imgupload', formData).then((data) => {
        if (data.data.path) {
          this.signImg = 'https://bagcw.com' + data.data.path
          this.modalInfo.content.signImg = data.data.path
        }
      })
    },
    addCompany (company, product) {
      let products = JSON.stringify(product)
      let orderJson = ''
      if (this.orderTypes.length > 0) {
        const orderType = this.orderTypes.map((orderType) => {
          let json = {}
          json[orderType] = this[orderType]
          return json
        })
        orderJson = JSON.stringify(orderType)
      }
      company.nongga_product = products
      company.order_type = orderJson

      this.ac_productInfoUpload(company)
      this.orderTypes = []
      this.companyEmail = ''
      this.deliveryEmail = ''
      this.kakaoTalk = ''
      this.sms = ''
      this.ac_getProductData()
    },
    updateCompany (company, product) {
      let products = JSON.stringify(product)
      let orderJson = ''
      if (this.orderTypes.length > 0) {
        const orderType = this.orderTypes.map((orderType) => {
          let json = {}
          json[orderType] = this[orderType]
          return json
        })
        orderJson = JSON.stringify(orderType)
      }
      company.nongga_product = products
      company.order_type = orderJson
      this.ac_updateProductData(company)
      this.ac_getProductData()
    },
    addProduct () {
      this.productInputs.push(Vue.util.extend({}, this.productInput))
    },
    removeProductInput (index) {
      Vue.delete(this.productInputs, index)
    },
    createRow () {
      this.modalInfo.content = {}
      this.productInputs = []
      this.$refs.create_modalInfo.show()
    },
    updateRow (item, index, button) {
      this.companyEmail = ''
      this.deliveryEmail = ''
      this.kakaoTalk = ''
      this.sms = ''
      this.orderTypes = []
      if (item.order_type) {
        const orderType = JSON.parse(item.order_type)
        for (let i = 0; i < orderType.length; i++) {
          let key = Object.keys(orderType[i])[0]
          this.orderTypes.push(key)
          this[key] = orderType[i][key]
        }
      }
      this.productInputs = []
      this.modalInfo.title = `Row index: ${index}`
      item.pw = ''
      this.modalInfo.content = item
      this.productInputs = this.modalInfo.content.nongga_product
      this.$root.$emit('bv::show::modal', 'update_modalInfo', button)
    },
    resetModal () {
      this.modalInfo.title = ''
      this.modalInfo.content = ''
      this.productInputs = []
    },
    createId (index) {
      this.productInputs[index].code = Math.random().toString(36).substr(2, 16)
    }
  }

}
</script>
<style>

</style>
