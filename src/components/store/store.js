import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import BB_utils from '../../service/bb_utils.js'
import TableToArray from '../service/tableToArray.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    userData: null,
    snsProduct: null,
    orderData: null,
    dateData: null,
    uniqCode: null,
    monthData: null,
    productData: null,
    PredictorData: null,
    NewOrderNaverData: null,
    NewOrderEsmData: null,
    isbusy: false,
    NewOrderData: null,
    jungsan:null,
    jungsanComplete: null
  },
  getters: {
    getUserData: function (state) {
      return state.userData
    },
    getSnsProduct: function (state) {
      return state.snsProduct
    },
    getOrderData: function (state) {
      return state.orderData
    },
    getDateData: function (state) {
      return state.dateData
    },
    getUniqCode: function (state) {
      return state.uniqCode
    },
    getMonthData: function (state) {
      return state.monthData
    },
    getproductData: function (state) {
      return state.productData
    },
    getPredictorData: function (state) {
      return state.PredictorData;
    },
    getNewOrderNaverData: function (state) {
      return state.NewOrderNaverData;
    },
    getNewOrderEsmData: function (state) {
      return state.NewOrderEsmData;
    },
    getIsbusy: function (state) {
      return state.isbusy
    },
    getNewOrderData: function (state) {
      return state.NewOrderData;
    },
    getJungSanData: function (state) {
      return state.jungsan
    },
    getJungSanCompleteData: function (state) {
      return state.jungsanComplete
    }

  },
  mutations: {
    addUserData: function (state, payload) {
      state.userData = payload.arr
      return state.userData
    },
    getSnsProduct: function (state, payload) {
      state.snsProduct = payload.snsProduct
      return state.snsProduct
    },
    mu_getOrderData: function (state, payload) {
      state.orderData = payload
      return state.orderData
    },
    mu_getMonthData: function (state, payload) {
      state.monthData = payload
      return state.monthData
    },
    mu_getDateData: function (state, payload) {
      state.dateData = payload
      return state.dateData
    },
    mu_getUniqCode: function (state, payload) {
      state.uniqCode = payload
      return state.uniqCode
    },
    mu_getProductData: function (state, payload) {
      state.productData = payload
      return state.productData
    },
    mu_getPredictData: function (state, payload) {
      state.PredictorData = payload
      return state.PredictorData
    },
    mu_getNewOrderNaver: function (state, payload) {
      state.NewOrderNaverData = payload
      return state.NewOrderNaverData
    },
    mu_getNewOrderEsm: function (state, payload) {
      state.NewOrderEsmData = payload
      return state.NewOrderEsmData
    },
    mu_getNewOrder: function (state, payload) {
      state.NewOrderData = payload
      return state.NewOrderData
    },
    mu_getIsbusy: function (state, payload) {
      state.isbusy = payload
      return state.isbusy
    },
    mu_getJungSantData: function (state, payload) {
      state.jungsan = payload
      return state.jungsan
    },
    mu_getJungSanCompleteData: function (state, payload) {
      state.jungsanComplete = payload
      return state.jungsanComplete
    }
  },
  actions: {
    ac_jungsanDataUpload: function (context, payload) {
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.put('https://bagcw.com/jungsan', payload).then ((res) => {
        console.log(res)
      })
    },
    ac_getJungSanData: function (context, payload) {
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.get('https://bagcw.com/jungsan').then((res) => {
        context.commit('mu_getJungSantData', res.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    ac_getJungSanCompleteData: function (context, payload) {
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.get('https://bagcw.com/jungsan/complete').then((res) => {
        context.commit('mu_getJungSanCompleteData', res.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    ac_getNewOrderData: function (context, payload) {
      console.log('새주문 요청하자')
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.get('https://bagcw.com/jumun/neworder').then((res) => {
        if(res.data) {
          console.log(res.data)
          context.commit('mu_getNewOrder', res.data)
        }
      }).catch((err) => {
        alert(err)
        console.log(err)
      })
    },
    ac_getNewOrderNaver: function (context, payload) {
        context.commit('mu_getIsbusy', true)
        Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
        Axios.get('https://bagcw.com/jumun/new_order/naver').then((res) => {
          if(res.data) {
            console.log(res.data)
            context.commit('mu_getIsbusy', false)

          }
        }).catch((err) => {
          alert(err)
          console.log(err)
        })
    },
    ac_getNewOrderEsm: function (context, payload) {
      context.commit('mu_getIsbusy', true)
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.get('https://bagcw.com/jumun/new_order/esm').then((res) => {
        if(res.data) {
          console.log(res.data)
          context.commit('mu_getIsbusy', false)
          context.commit('mu_getNewOrderEsm', res.data)
        }
      }).catch((err) => {
        alert(err)
        console.log(err)
      })
  },
  ac_getNewOrderCoupang: function (context, payload) {
    context.commit('mu_getIsbusy', true)
    Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    Axios.get('https://bagcw.com/jumun/new_order/coupang').then((res) => {
      if(res.data) {
        console.log(res.data)
        context.commit('mu_getIsbusy', false)
        context.commit('mu_getNewOrderEsm', res.data)
      }
    }).catch((err) => {
      alert(err)
      console.log(err)
    })
  },
  ac_getNewOrder11st: function (context, payload) {
    context.commit('mu_getIsbusy', true)
    Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    Axios.get('https://bagcw.com/jumun/new_order/11st').then((res) => {
      if(res.data) {
        console.log(res.data)
      }
    }).catch((err) => {
      alert(err)
      console.log(err)
    })
  },
    ac_productDataUpload: function (context, payload) {
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.post('https://bagcw.com/jumun', payload).then((res) => {
        if(res.data.success) {
          alert('업로드 완료')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    //2019-01-12 업데이트
    ac_productInfoUpload: function (context, payload) {
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.post('https://bagcw.com/product', payload).then((res) => {
        if (res) {
          alert('업로드 완료')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    //2019-01-12 업데이트
    ac_getProductData: function (context, payload) {
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.get('https://bagcw.com/product').then((res) => {
        alert('데이터 받기 완료')
        for(let i = 0; i < res.data.length; i++) {
          var json = JSON.parse(res.data[i].nongga_product)
          res.data[i].nongga_product = json

        }
        context.commit('mu_getProductData', res.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    ac_updateProductData: function (context, payload) {
      Axios.put('https://bagcw.com/product', payload).then((res) => {
        if (res) alert('업로드 완료')
      })
    },
    ac_changePartnerInfo: function (context, payload) {
      Axios.put('https://bagcw.com/product/partner', payload).then((res) => {
        if (res) alert('아이디 비번 변경 완료')
      })
    },
    ac_updateData1: function (context, payload) {
      let json = payload.map((item) => {
        return {
          date: item.date,
          num: item.num
        }
      })
      Axios.put('https://bagcw.com/jumun', json).then((res) => {
        if (res.data) {
          alert('수정성공')
        }
      })
    },
    ac_callDataUpload: function (context, payload) {
      var data = payload;
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.post('https://bagcw.com/jumun/call', data,).then((res) => {
        if(res.data === "ok") {
          alert("저장완료")
        }
        }).catch((err) => {
          console.log(err)
        })
    },
    ac_getOrderData: function (context, payload) {
      var date = payload
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.get('https://bagcw.com/jumun/' + date).then((res) => {
        let bbUtils = new BB_utils()
        let orderData = bbUtils.getOrder(res.data)
        context.commit('mu_getOrderData', orderData.jumunData)
        context.commit('mu_getUniqCode', orderData.uniqCode)
      }).catch((err) => {
        console.log(err)
      })
    },
     // 월별 조회
     ac_getMonthData: function (context, payload) {
      var month = payload
      if (month === null) alert('날짜를 선택해 주세요')
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.get('https://bagcw.com/jumun/month/' + month).then((res) => {
        context.commit('mu_getMonthData', res.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    async ac_getDateData (context, payload) {
      var date1 = payload.date1
      var date2 = payload.date2
      let companyInfos = []
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')

      Axios.get('https://bagcw.com/product').then((data) => {
        companyInfos = data.data
      })
      Axios.get('https://bagcw.com/jumun/' + date1 + '/' + date2).then((res) => {
        if(res) {
          alert('데이터 가져왔음')
          let bbUtils = new BB_utils()
          let dateData = bbUtils.getJumun(res.data)
          var deleveryEditData = dateData.jumunData.reduce(function (accumulator, current, index) {
            for (let i = 0; i < companyInfos.length; i++) {
              const products = JSON.parse(companyInfos[i].nongga_product)
              for (let k = 0; k < products.length; k++) {
                if (current.cw_code === products[k].code) {
                  current.delivery_pay = products[k].deliveryPrice
                  if (companyInfos[i].conditinal_free) {
                    if (companyInfos[i].conditinal_free <= current.sell_price) {
                      current.delivery_pay = 0
                    }
                  }
                }
              }
            }
          if (checkIfAlreadyExist(current)) {
              current.delivery_pay = 0
              return accumulator.concat([current]);
            } else {
              return accumulator.concat([current]);
            }
            function checkIfAlreadyExist(currentVal) {
              return accumulator.some((item) => {
                return (item.product_code === currentVal.product_code && item.su === currentVal.su && item.address === currentVal.address && item.date === current.date);
              });
            }
          }, []);
          context.commit('mu_getDateData', deleveryEditData)
          context.commit('mu_getUniqCode', dateData.uniqCode)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    ac_updateData: function (context, payload) {
      let json
      if(payload.flag === 'single') {
        delete payload.flag
        json = payload
      }else{
        json = payload
      }
      Axios.put('https://bagcw.com/jumun', json).then((res) => {
        alert('수정완료')
      })
    },
    ac_songjangUpdateData: function (context, payload) {
      let json = payload.map((item) => {
        // 공백 - ~ 제거 후 등록
        let deliveryNum
        if (item.delivery_num) {
          let a = item.delivery_num
          let b = a.replace(/\-/g, '')
          let c = b.replace(/\~/g, '')
          deliveryNum = c.replace(/\s/g, '')
        } else {
          deliveryNum = null
        }

        return {
          delivery_num: deliveryNum,
          delivery_company: item.delivery_company,
          num: item.num
        }
      })
      Axios.put('https://bagcw.com/jumun', json).then((res) => {
        if (res.data) {
          alert('수정성공')
        }
      })
    },
    ac_deleteData: function (context, payload) {
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
      Axios.post('https://bagcw.com/jumun/delete', payload).then((res) => {
        if(res.data.success) {
          alert('삭제 완료')
          const idx = this.state.dateData.findIndex(function(item) {return item.num === payload.num})
          if (idx > -1) this.state.dateData.splice(idx, 1)
          context.commit('mu_getDateData', this.state.dateDate)
        }
      })
    },
    ac_getPredictData: function (context, payload) {

    },

    ac_addSnsProduct: function (context, payload) {
      var file = payload.file
    },
    ac_getSnsProduct: function (context) {
      var snsProduct = []
      return ;
    },
    ac_updateSnsProduct: function (context) {

    },
    ac_deleteSnsProduct: function (context) {

    }
  }
})
