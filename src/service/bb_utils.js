export default class BButils {
    getJumun (values) {
      var productCode = []
      for (var i = 0; i < values.length; i++) {
        var d = new Date(Date.parse(values[i].date))
        d = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)
        values[i].date = d
        let changeCode = this.changeCode(values[i].product_code)
        values[i].product_code = changeCode
        productCode.push(values[i].product_code)
      }
      var uniqProduct_code = this.uniqArr(productCode)
      return {jumunData: values, uniqCode: uniqProduct_code}
    }
    getOrder (values) {
      var productCode = []
      var data = this.sorting(values).reduce(function (accumulator, current) {
        var d = new Date(Date.parse(current.date))
        d = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)
        current.date = d
        productCode.push(current.product_code)

        if (current.product_option === null) {
          current.product_option = `${current.product_name} - ${current.cnt}개`
        } else {
          current.product_option = `${current.product_option} - ${current.cnt}개`
        }
        if (checkIfAlreadyExist(current)) {
          return accumulator
        } else {
          return accumulator.concat([current])
        }
        function checkIfAlreadyExist (currentVal) {
          return accumulator.some((item) => {
            if (item.product_code === currentVal.product_code && item.su === currentVal.su && item.address === currentVal.address && item.date === current.date) {
              item.product_option = `${item.product_option} / ${currentVal.product_option}`
              item.jungbok = ''
            }
            return (item.product_code === currentVal.product_code && item.su === currentVal.su && item.address === currentVal.address && item.date === current.date)
          })
        }
      }, [])
      const jumunData = this.sortingByNum(data)
      var uniqProduct_code = this.uniqArr(productCode)
      return { jumunData: jumunData, uniqCode: uniqProduct_code }
    }

    sorting (items) {
      items.sort((a, b) => {
        const nameA = a.product_option
        const nameB = b.product_option
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
      return items
    }

    sortingByNum (items) {
      items.sort((a, b) => {
        const nameA = a.num
        const nameB = b.num
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
      return items
    }

    changeCode (code) {
      if (code === '404358') code = '파프리카'
      if (code === '404340') code = '새조개샤브샤브'
      if (code === '403149') code = '패션후르츠'
      if (code === '404359') code = '꽈리고추'
      if (code === '403134') code = '김현숙 손맛'
      if (code === '405484') code = '징거미새우_28000'
      return code
    }

    uniqArr (arr) {
      var chk = []
      for (var i = 0; i < arr.length; i++) {
        if (chk.length === 0) {
          chk.push(arr[i])
        } else {
          var flg = true
          for (var j = 0; j < chk.length; j++) {
            if (chk[j] === arr[i]) {
              flg = false
              break
            }
          }
          if (flg) {
            chk.push(arr[i])
          }
        }
      }
      return chk
    }

    incommingConcat (arr) {
      var chk = []
      var t
      for (var i = 0; i < arr.length; i++) {
        if (chk.length === 0) {
          chk.push(arr[i])
        } else {
          var flg = true

          for (var j = 0; j < chk.length; j++) {
            if (chk[j][0] + chk[j][3] === arr[i][0] + arr[i][3]) {
                t = parseInt(chk[j][4]) + parseInt(arr[i][4])
              chk[j][4] = t
              flg = false

              break
            }
          }

          if (flg) {
            chk.push(arr[i])
          }
        }
      }

      return chk
    }

    textConcat (arr) {
      var chk = []

      for (var i = 0; i < arr.length; i++) {
        if (this.changeName(arr[i][7], arr[i][8]) == null) {
          arr[i][7] = arr[i][7] + arr[i][8] + '개'
        } else {
          arr[i][7] = this.changeName(arr[i][7], arr[i][8]).name
        }

        var nameAddress1 = arr[i][2] + arr[i][6]

        var t = ''
        if (chk.length === 0) {
          chk.push(arr[i])
        } else {
          var flg = true

          for (var j = 0; j < chk.length; j++) {
            var nameAddress2 = chk[j][2] + chk[j][6]

            if (nameAddress2 === nameAddress1) {
              t = chk[j][7] + '/' + arr[i][7]

              chk[j][7] = t

              flg = false

              break
            }
          }

          if (flg) {
            chk.push(arr[i])
          }
        }
      }

      return chk
    }

    wonToInt (won) {
      var won = won.substring(1, won.length)
      won = won.replace(/,/g, '')
      return won
    }

    aucToInt (won) {
      won = won.replace(/,/g, '')
      won = parseInt(won)
      return won
    }

    changeName (name, cnt) {
      var chaneged = ''
      var price = ''

      switch (name) {
        case '가리비 선택하기: 달달한 홍가리비 2kg':
          chaneged = '홍가리비 2kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '홍가리비 1kg':
          chaneged = '홍가리비'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '초고추장 40g':
          chaneged = '초고추장 ' + cnt
          price = 1000
          return {name: chaneged, price: price}
          break

        case '해만가리비 1kg':
          chaneged = '가리비'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '가리비 선택하기: 해만가리비 1kg':
          chaneged = '가리비 ' + cnt + 'kg'
          price = 3500
          return {name: chaneged, price: price}
          break

        case '가리비 선택하기: 달달한 홍가리비 1kg':
          chaneged = '홍가리비 ' + cnt + 'kg'
          price = 4000
          return {name: chaneged, price: price}
          break

        case '가리비 선택하기: 큰 해만가리비 1kg(7cm 이상)':
          chaneged = '특가리비 ' + cnt + 'kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개부터 발송 가능합니다.:전통 팥 망개떡 1팩(10개입)/1개':
          chaneged = '팥망개떡 ' + cnt + '팩'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개부터 발송 가능합니다.:고소한 견과 망개떡 1팩(10개입)/2000원/1개':
          chaneged = '견과망개떡 ' + cnt + '팩'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개부터 발송 가능합니다.:자색고구마 망개떡 1팩(10개입)/1000원/1개':
          chaneged = '자색고구마 망개떡 ' + cnt + '팩'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개부터 발송 가능합니다.:전통 팥 망개떡 1팩(10개입)/4개':
          chaneged = '팥망개떡 ' + cnt + '팩'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개부터 발송 가능합니다.:전통 팥 망개떡 1팩(10개입)/2개':
          chaneged = '팥망개떡 ' + cnt + '팩'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개 이상 주문 시 발송됩니다.: 전통 팥 망개떡 1팩(10개입)':
          chaneged = '팥망개떡 ' + cnt + '팩'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개 이상 주문 시 발송됩니다.: 고소한 견과 망개떡 1팩(10개입)':
          chaneged = '견과망개떡 ' + cnt + '팩'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '바다의 보양식 자연산 통영 장어 1kg 大 산지직송 상품':
          chaneged = '바다장어大 ' + cnt + 'kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '파머스토리 경남 통영 김민주님의 생굴 1kg 오동통 싱싱한 햇 생굴':
          chaneged = '생굴 ' + cnt + 'kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '- 우리동네 캠핑장 고기선택 -: 국내산 한우 - 꽃살 100g':
          chaneged = '한우 꽃살 100g ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '- 우리동네 캠핑장 고기선택 -: 사장님 추천 - 소불고기 1kg':
          chaneged = '소불고기 1kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '- 우리동네 캠핑장 고기선택 -: 국내산 한우 - 부채(낙엽)살 100g':
          chaneged = '부채(낙엽)살 100g ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '- 우리동네 캠핑장 고기선택 -: 국내산 한우 - 제비추리 100g':
          chaneged = '제비추리 100g 100g ' + cnt + '개'
          price = 4980
          return {name: chaneged, price: price}
          break

        case '각굴2kg':
          chaneged = '각굴 2kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '초고추장':
          chaneged = '초고추장'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '가리비 1kg':
          chaneged = '가리비 1kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '선택: 조개모듬 커플세트(1~2인)':
          chaneged = '조개모듬 일반(2kg) ' + cnt + '개'
          price = 8500
          return {name: chaneged, price: price}
          break

        case '한우고기 1개':
          chaneged = '한우고기 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '촌놈곰탕 선택하기: 구수한 촌놈곰탕 520gX2개입':
          chaneged = '촌놈곰탕 520gX2개 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '시장의 인심을 받아보세요! 구성 선택: 해물탕용 2인용':
          chaneged = '해물탕용 2인용(삼천포) ' + cnt + '개'
          price = 20000
          return {name: chaneged, price: price}
          break

        case '햇 레드비트 5kg 밭에서 뽑아 바로 보내요!':
          chaneged = '레드비트 5kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '경남 창원 박순용님의 햇 레드비트 5kg 상품':
          chaneged = '레드비트 5kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '15000원 이상 배송됩니다.: 농후발효유 요거트 150ml x 2개':
          chaneged = '요거트 150ml x 2개 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '새콤달콤 패션후르츠 선택하기: 백향과 가정용 1kg(65g~90g) 20과 내외':
          chaneged = '백향과 1kg ' + cnt + '개'
          price = 13410
          return {name: chaneged, price: price}
          break

        case '산지직송! 맵싹한 청양고추 1kg':
          chaneged = '청량고추 1kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '그린키위&골드키위 선택: 그린키위 3kg[28과 내외]':
          chaneged = '그린키위 3kg[28과 내외] ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '자연산 홍합·바지락살 선택하기: 자연산 바지락살 1kg(급랭)':
          chaneged = '자연산 바지락살 1kg(급랭) ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '자연산 홍합·바지락살 선택하기: 자연산 홍합살 1kg(급랭)':
          chaneged = '자연산 홍합살 1kg(급랭) ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '멸치 종류 선택하기: 볶음용 멸치(세멸/상품) 300g':
          chaneged = '볶음용 멸치(세멸/상품) 300g ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '맛있는 돌김을 골라드려요~ 반속(50장) 옛날돌김':
          chaneged = '반속(50장) 옛날돌김 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개 이상 주문 시 발송 가능: 양념 콩잎 400g':
          chaneged = '양념 콩잎 400g ' + cnt + '개'
          price = 14000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개 이상 주문 시 발송 가능: 양념 깻잎 400g':
          chaneged = '양념 깻잎 400g ' + cnt + '개'
          price = 13000
          return {name: chaneged, price: price}
          break

        case '[산지직송] 신선하고 통통한 통영 햇 생굴 1kg':
          chaneged = '생굴 ' + cnt + 'kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '생굴 각굴 선택하기: 삶고 구워먹기 좋은 각굴 5kg':
          chaneged = '각굴 5kg' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '가리비 종류 선택하기:해만가리비 1kg/1개':
          chaneged = '가리비 ' + cnt + 'kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '가리비 종류 선택하기:홍가리비 1kg/1개':
          chaneged = '홍가리비 ' + cnt + 'kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개 이상 주문 시 발송 가능: 양념 콩잎 400g':
          chaneged = '양념콩잎 400g ' + cnt + '개'
          price = 14000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개 이상 주문 시 발송 가능: 양념 깻잎 400g':
          chaneged = '양념깻잎 400g ' + cnt + '개'
          price = 13000
          return {name: chaneged, price: price}
          break

        case '장아찌 선택: 된장콩잎장아찌(300g)':
          chaneged = '된장콩잎장아찌(300g) ' + cnt + '개'
          price = 10000
          return {name: chaneged, price: price}
          break

        case '장아찌 선택: 양념콩잎장아찌(300g)':
          chaneged = '양념콩잎장아찌(300g) ' + cnt + '개'
          price = 10000
          return {name: chaneged, price: price}
          break

        case '시장의 인심을 받아보세요! 구성 선택: 조개구이용 2인용':
          chaneged = '조개구이용 2인용(삼천포) ' + cnt + '개'
          price = 20000
          return {name: chaneged, price: price}
          break

        case '햇 단감 선택하기: 햇 단감 5kg [25과 내외]':
          chaneged = '햇 단감 5kg [25과 내외] ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '싱싱하고 튼실한 햇 가지 5kg':
          chaneged = '햇 가지 5kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '포장 특성상 2개 이상 주문 시 발송됩니다.: 자색 고구마 망개떡 1팩(10개입)':
          chaneged = '자색고구마망개떡 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '맛있는 돌김을 골라드려요~ 반속(50장) 재래돌김 곱창김':
          chaneged = '반속(50장) 재래돌김 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '멸치 종류 선택하기: 국물용 멸치(대멸/상품) 1.5kg 박스포장':
          chaneged = '국물용 멸치(대멸/상품) 1.5kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '청춘건어물 골라담기: 아구포(쥐포형) 10장 내외(중국산)':
          chaneged = '아구포(쥐포형) 10장 내외(중국산) ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '청춘건어물 골라담기: 아구포(통마리형) 10장 내외(중국산)':
          chaneged = '아구포(통마리형) 10장 내외(중국산) ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '청춘건어물 골라담기: 명태알포 15장 내외(러시아산)':
          chaneged = '청춘건어물 골라담기: 명태알포 15장 내외(러시아산) ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '파머스토리 경남 진주 배진순님의 청양고추 500g':
          chaneged = '청양고추 500g ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '맛있는 돌김을 골라드려요~ 반속(50장) 옛날돌김':
          chaneged = '반속(50장) 옛날돌김 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '망개떡 선택하기:고소한 견과 망개떡 1팩+자색고구마 망개떡 1팩/3000원/1개':
          chaneged = '견과 망개떡 1팩/자색고구마 망개떡 1팩 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '망개떡 선택하기:전통 팥 망개떡 1팩+고소한 견과 망개떡 1팩/2000원/1개':
          chaneged = '팥 망개떡 1팩/견과 망개떡 1팩 ' + cnt + '개'
          price = 14000
          return {name: chaneged, price: price}
          break

        case '망개떡 선택하기:고소한 견과 망개떡 2팩/4000원/1개':
          chaneged = '견과 망개떡 2팩 ' + cnt + '개'
          price = 16000
          return {name: chaneged, price: price}
          break

        case '망개떡 선택하기:전통 팥 망개떡 2팩/1개':
          chaneged = '팥 망개떡 2팩 ' + cnt + '개'
          price = 12000
          return {name: chaneged, price: price}
          break

        case '수제 요거트·치즈 15.000원 이상 골라담기: 쫄깃한 찢어먹는 치즈 100g':
          chaneged = '찢어먹는 치즈 100g ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '수제 요거트·치즈 15.000원 이상 골라담기: 농후발효유 요거트 1000ml':
          chaneged = '요거트 1000ml ' + cnt + '개'
          price = 6500
          return {name: chaneged, price: price}
          break

        case '홍가리비 1kg':
          chaneged = '홍가리비 ' + cnt + 'kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '가리비 1kg':
          chaneged = '해만가리비 ' + cnt + 'kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '가리비 1kg':
          chaneged = '가리비 ' + cnt + 'kg'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '시장의 인심을 받아보세요! 구성 선택: 해물탕용 5~6인용':
          chaneged = '해물탕용 5~6인용 ' + cnt + '개'
          price = 50000
          return {name: chaneged, price: price}
          break

        case '시장의 인심을 받아보세요! 구성 선택: 해물탕용 3~4인용':
          chaneged = '해물탕용 3~4인용 ' + cnt + '개'
          price = 30000
          return {name: chaneged, price: price}
          break

        case '시장의 인심을 받아보세요! 구성 선택: 조개구이용 3~4인용':
          chaneged = '조개구이용 3~4인용 ' + cnt + '개'
          price = 30000
          return {name: chaneged, price: price}
          break

        case '와사비장':
          chaneged = '와사비장 ' + cnt + '개'
          price = 0
          return {name: chaneged, price: price}
          break

        case '와사비장':
          chaneged = '와사비장 ' + cnt + '개'
          price = 0
          return {name: chaneged, price: price}
          break

        case '딱새우 선택: 딱새우 1kg':
          chaneged = '딱새우 1kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '바다보양식 통영 자연산 장어 1kg(大) 4~6미':
          chaneged = '바다장어 1kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '창원아재들 소라선택: 뿔소라 1kg(5개~8개)':
          chaneged = '뿔소라 1kg(5개~8개) ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '망개떡 선택하기:고소한 견과 망개떡 1팩+자색고구마 망개떡 1팩/3000원/1개	':
          chaneged = '견과망개떡 1팩/자색고구마망개떡 1팩 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '망개떡 선택하기:전통 팥 망개떡 1팩+고소한 견과 망개떡 1팩/2000원/2개':
          chaneged = '팥 망개떡 1팩/견과망개떡 1팩 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '망개떡 선택하기:전통 팥 망개떡 2팩/2개':
          chaneged = '팥 망개떡 2팩 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '장아찌 선택: 가죽장아찌(300g)':
          chaneged = '가죽장아찌(300g) ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '정말 달다! 무유황 단감말랭이 250gX2개입':
          chaneged = '무유황 단감말랭이 250gX2개 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '수제 요거트·치즈 15.000원 이상 골라담기: 고소한 구워먹는 치즈 120g':
          chaneged = '구워먹는 치즈 120g ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '청춘건어물 골라담기: 반건조오징어 5마리(국내산) 특대':
          chaneged = '반건조오징어 5마리(국내산) 특대 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '청춘건어물 골라담기: 쥐포 7~8장(국내산)':
          chaneged = '쥐포 7~8장(국내산) ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '청춘건어물 골라담기: 건조오징어 3마리(국산)':
          chaneged = '건조오징어 3마리(국산) ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '청춘건어물 골라담기: 반건조오징어 5마리(국내산) 대':
          chaneged = '반건조오징어 5마리(국내산) 대 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '수제 요거트·치즈 15.000원 이상 골라담기: 농후발효유 요거트 150ml x 2개':
          chaneged = '농후발효유 요거트 150ml x 2개 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '가리비 선택하기: 달달한 큰 홍가리비 1kg(7cm 이상)':
          chaneged = '특홍가리비 ' + cnt + 'kg'
          price = 6000
          return {name: chaneged, price: price}
          break

        case '완숙토마토 선택하기: 완숙토마토 1번':
          chaneged = '완숙토마토 1번 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '촌놈곰탕 선택하기: 구수한 촌놈곰탕 520gX10개입':
          chaneged = '촌놈곰탕 520gX10개입 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '바다향 가득! 싱싱한 통영 생굴 1kg':
          chaneged = '생굴 ' + cnt + 'kg'
          price = 9000
          return {name: chaneged, price: price}
          break

        case '산지직송! 통영 햇 생굴 1kg':
          chaneged = '생굴 ' + cnt + 'kg'
          price = 9000
          return {name: chaneged, price: price}
          break

        case '파절이':
          chaneged = '파절이 ' + cnt + '개'
          price = 1350
          return {name: chaneged, price: price}
          break

        case '멸치 종류 선택하기: 국물용 멸치(대멸/중상품) 1.5kg 박스포장':
          chaneged = '국물용 멸치(대멸/중상품) 1.5kg ' + cnt + '개'
          price = 15000
          return {name: chaneged, price: price}
          break

        case '새콤달콤 패션후르츠 선택하기: 백향과 선물용(75g~90g) 12과':
          chaneged = '백향과 선물용(75g~90g) 12과 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '새콤달콤 패션후르츠 선택하기: 백향과 가정용 1kg(65g~90g) 15과 내외':
          chaneged = '백향과 가정용 ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '레드비트 5kg 밭에서 뽑아 바로 보내요!':
          chaneged = '레드비트5kg ' + cnt + '개'
          price = 18000
          return {name: chaneged, price: price}
          break

        case '창원아재 버섯 종류 선택: 새송이버섯 특품 2kg':
          chaneged = '새송이버섯 특품 2kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '창원아재 버섯 종류 선택: 표고버섯 특품 1kg':
          chaneged = '표고버섯 특품 1kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '창원아재 버섯 종류 선택: 모듬버섯(새송이/표고/느타리) 700g~800g':
          chaneged = '모듬버섯(새송이/표고/느타리) 700g~800g ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '수제 요거트·치즈 15.000원 이상 골라담기: 농후발효유 요거트 500ml':
          chaneged = '요거트 500ml ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '-- 재약산 벌꿀 선택 --: 아카시아벌꿀 1.2kg':
          chaneged = '아카시아벌꿀 1.2kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '-- 재약산 벌꿀 선택 --: 잡화꿀 600g':
          chaneged = '잡화꿀 600g ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '새콤달콤 그린키위 3kg':
          chaneged = '그린키위 3kg ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '요거트 500/찢어먹는치즈 1/구워먹는치즈 1':
          chaneged = '요거트 500ml/찢어먹는치즈 1개/구워먹는치즈 1개  ' + cnt + '개'
          price = 5000
          return {name: chaneged, price: price}
          break

        case '대게(10~10.9cm) 대 3마리 - 1~2인 기준':
          chaneged = '대게(10~10.9cm) 대 3마리 - 1~2인 기준  ' + cnt + '개'
          price = 44000
          return {name: chaneged, price: price}
          break

        case '대게·홍게 선택하기: 홍게(10마리 내외) 기본 3kg - 2~3인 기준':
          chaneged = '홍게(10마리 내외) 기본 3kg - 2~3인 기준  ' + cnt + '개'
          price = 19000
          return {name: chaneged, price: price}
          break

        case '백향과 선물용(75g~90g)':
          chaneged = '백향과 선물용(75g~90g) ' + cnt + '개'
          price = 17910
          return {name: chaneged, price: price}
          break

        case '생생이 홍합 구성 선택하기: 생생이 세척 홍합 5kg':
          chaneged = '세척 홍합 5kg ' + cnt + '개'
          price = 8900
          return {name: chaneged, price: price}
          break

        case '달콤한 홍가리비 선택하기: 큰 홍가리비(15~20미) - 1~2인 기준':
          chaneged = '특홍가리비 ' + cnt + '개'
          price = 6000
          return {name: chaneged, price: price}
          break
      }
    }
  }
