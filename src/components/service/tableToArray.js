export default class TableToArray {
  constructor () {
    this.tableId = null
    this.tableArray = []
  }

  getArray (id) {
    let trs = document.querySelectorAll('#' + id + '>tbody>tr')
    let tdLen = trs[0].childNodes.length
    for (let i = 0; i < trs.length; i++) {
      this.tableArray[i] = []
      for (let k = 3; k < tdLen; k++) {
        this.tableArray[i][0] = trs[i].childNodes[0].childNodes[0].checked
        this.tableArray[i][1] = trs[i].childNodes[1].childNodes[0].value
        this.tableArray[i][2] = trs[i].childNodes[2].childNodes[0].value
        this.tableArray[i][k] = trs[i].childNodes[k].textContent
      }
    }
    return this.tableArray
  }

  getJson (id, dist) {
    var trs = document.querySelectorAll('#' + id + '>tbody>tr')
    var tdLen = trs[0].childNodes.length
    var counter = 0;
    if(dist === 'order') {
      for (let i = 0; i < trs.length; i++) {
        if (trs[i].childNodes[0].childNodes[0].checked) {
          for (let k = 0; k < tdLen; k++) {
              this.tableArray[counter] = {}
              this.tableArray[counter]['date'] = trs[i].childNodes[1].childNodes[0].value
              this.tableArray[counter]['cancle'] = trs[i].childNodes[2].childNodes[0].value
              this.tableArray[counter]['num'] = trs[i].childNodes[13].textContent
            }
          counter++
        }
      }
    }else if(dist === 'search') {
      console.log(trs)
      for (let i = 0; i < trs.length; i++) {
        if (trs[i].childNodes[0].childNodes[0].childNodes[0].checked) {
          for (let k = 0; k < tdLen; k++) {
              this.tableArray[counter] = {}
              this.tableArray[counter]['date'] = trs[i].childNodes[1].childNodes[0].childNodes[0].value
              this.tableArray[counter]['cancle'] = trs[i].childNodes[2].childNodes[0].childNodes[0].value
              this.tableArray[counter]['delivery_company'] = trs[i].childNodes[3].childNodes[0].childNodes[0].value
              this.tableArray[counter]['delivery_num'] = trs[i].childNodes[4].childNodes[0].childNodes[0].value
              this.tableArray[counter]['jumunja'] = trs[i].childNodes[5].childNodes[0].childNodes[0].value
              this.tableArray[counter]['jumun_num'] = trs[i].childNodes[6].childNodes[0].childNodes[0].value
              this.tableArray[counter]['su'] = trs[i].childNodes[7].childNodes[0].childNodes[0].value
              this.tableArray[counter]['su_num1'] = trs[i].childNodes[8].childNodes[0].childNodes[0].value
              this.tableArray[counter]['su_num2'] = trs[i].childNodes[9].childNodes[0].childNodes[0].value
              this.tableArray[counter]['zipcode'] = trs[i].childNodes[10].childNodes[0].childNodes[0].value
              this.tableArray[counter]['address'] = trs[i].childNodes[11].childNodes[0].childNodes[0].value
              this.tableArray[counter]['product_name'] = trs[i].childNodes[12].childNodes[0].childNodes[0].value
              this.tableArray[counter]['cnt'] = trs[i].childNodes[13].childNodes[0].childNodes[0].value
              this.tableArray[counter]['message'] = trs[i].childNodes[14].childNodes[0].childNodes[0].value
              this.tableArray[counter]['platform'] = trs[i].childNodes[15].childNodes[0].childNodes[0].value
              this.tableArray[counter]['product_code'] = trs[i].childNodes[16].childNodes[0].childNodes[0].value
              this.tableArray[counter]['gong_price'] = trs[i].childNodes[17].childNodes[0].childNodes[0].value
              this.tableArray[counter]['sell_price'] = trs[i].childNodes[18].childNodes[0].childNodes[0].value
              this.tableArray[counter]['jungsan_price'] = trs[i].childNodes[19].childNodes[0].childNodes[0].value
              this.tableArray[counter]['num'] = trs[i].childNodes[20].childNodes[0].textContent

            }
          counter++
        }
      }
    }
    return this.tableArray
  }

  getSongjang (id) {
    let trs = document.querySelectorAll('#' + id + '>tbody>tr')
    let tdLen = trs[0].childNodes.length
    for (let i = 0; i < trs.length; i++) {
      this.tableArray[i] = {}
      for (let k = 0; k < tdLen; k++) {
        if (trs[i].childNodes[0].childNodes[0].checked) {
          this.tableArray[i]['delivery_company'] = trs[i].childNodes[1].childNodes[0].value
          this.tableArray[i]['delivery_num'] = trs[i].childNodes[2].childNodes[0].value
          this.tableArray[i]['num'] = trs[i].childNodes[10].textContent
        }
      }
    }
    return this.tableArray
  }

  getDeleteJson (id) {
    let trs = document.querySelectorAll('#' + id + '>tbody>tr')
    let tdLen = trs[0].childNodes.length
    for (let i = 0; i < trs.length; i++) {
      this.tableArray[i] = {}
      for (let k = 0; k < tdLen; k++) {
        if (trs[i].childNodes[0].childNodes[0].checked) {
          this.tableArray[i]['num'] = trs[i].childNodes[13].textContent
        }
      }
    }
    return this.tableArray
  }
}


