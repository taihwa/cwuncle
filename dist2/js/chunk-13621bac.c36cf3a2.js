(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-13621bac"],{"1a33":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"list"},[a("h1",[t._v("상세페이지 목록")]),a("v-btn",{attrs:{color:"success"}},[a("router-link",{attrs:{to:"/write"}},[t._v("글쓰기")])],1),a("v-layout",{attrs:{row:""}},[a("v-flex",{attrs:{xs12:"",sm6:"","offset-sm3":""}},[a("v-card",t._l(t.lists,function(e){return a("v-list",{key:e.num,attrs:{"two-line":"",subheader:""}},[a("v-list-tile",{attrs:{avatar:""}},[a("v-list-tile-avatar",[a("v-icon",{staticClass:"blue white--text"},[t._v("assignment")])],1),a("v-list-tile-content",[a("v-list-tile-title",{domProps:{innerHTML:t._s(e.title)}})],1),a("v-btn",{attrs:{color:"success"},on:{click:function(a){return t.copy(e)}}},[t._v("복사")]),a("v-btn",{attrs:{color:"info"}},[a("router-link",{attrs:{to:"/update/"+e.num}},[t._v("수정")])],1),a("v-btn",{attrs:{color:"error"},on:{click:function(a){return t.deleteDetail(e)}}},[t._v("삭제")])],1),a("v-divider")],1)}),1)],1)],1)],1)},s=[],i=a("bc3a"),o=a.n(i),r={name:"list",data:function(){return{lists:[]}},created:function(){var t=this;o.a.get("https://todo.bagcw.com/nospo/detail").then(function(e){t.lists=e.data})},methods:{updateDetail:function(t){this.$router.push({path:"/update",params:{id:t.num}})},deleteDetail:function(t){var e=this;o.a.delete("https://todo.bagcw.com/nospo/detail/".concat(t.num)).then(function(t){"ok"===t.data&&(alert("삭제완료"),e.$router.push("/"))})},copy:function(t){var e=this;delete t.num,console.log(t),o.a.post("https://todo.bagcw.com/nospo/detail",t).then(function(t){t&&(alert("복사완료"),e.$router.push("/"))})}}},l=r,c=(a("ebb3"),a("2877")),u=a("6544"),d=a.n(u),v=a("8336"),p=a("b0af"),f=a("ce7e"),b=a("0e8f"),h=a("132d"),m=a("a722"),w=a("8860"),V=a("ba95"),_=a("c954"),k=a("5d23"),L=Object(c["a"])(l,n,s,!1,null,null,null);e["default"]=L.exports;d()(L,{VBtn:v["a"],VCard:p["a"],VDivider:f["a"],VFlex:b["a"],VIcon:h["a"],VLayout:m["a"],VList:w["a"],VListTile:V["a"],VListTileAvatar:_["a"],VListTileContent:k["a"],VListTileTitle:k["b"]})},deea:function(t,e,a){},ebb3:function(t,e,a){"use strict";var n=a("deea"),s=a.n(n);s.a}}]);
//# sourceMappingURL=chunk-13621bac.c36cf3a2.js.map