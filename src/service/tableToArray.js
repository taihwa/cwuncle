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
          console.log(trs[i].childNodes[k].textContent)
          this.tableArray[i][0] = trs[i].childNodes[0].childNodes[0].checked
          this.tableArray[i][1] = trs[i].childNodes[1].childNodes[0].value
          this.tableArray[i][2] = trs[i].childNodes[2].childNodes[0].value
          this.tableArray[i][k] = trs[i].childNodes[k].textContent
        }
      }
      return this.tableArray
    }
  
    getJson (id) {
      let trs = document.querySelectorAll('#' + id + '>tbody>tr')
      let tdLen = trs[0].childNodes.length
      for (let i = 0; i < trs.length; i++) {
        this.tableArray[i] = {}
        for (let k = 0; k < tdLen; k++) {
          if (trs[i].childNodes[0].childNodes[0].checked) {
            this.tableArray[i]['date'] = trs[i].childNodes[1].childNodes[0].value
            this.tableArray[i]['cancle'] = trs[i].childNodes[2].childNodes[0].value
            this.tableArray[i]['num'] = trs[i].childNodes[13].textContent
          }
        }
      }
      return this.tableArray
    }
  }
  