<template>
  <div>
    <h2 v-if="!getDateData">불러오는 중</h2>
    <h2 v-if="getDateData">로드 완료</h2>
    <DatePicker2 v-on:send-date="getDate" v-on:send-date2="getDate2"></DatePicker2>
    <input type="text" v-model='input_code' />
    <b-button v-on:click='ac_getDateData(orderDay)'>정산</b-button>
    <b-card title="업체명" class="com_code">
        <b-button variant="outline-warning" v-on:click='getList(uniq)' v-for='uniq in getUniqCode'>{{uniq}}</b-button>
    </b-card>
    <b-tabs content-class="mt-3">
    <b-tab title="정산(엑셀)" active>
      <b-button variant="success" v-on:click="saveToExcel()">엑셀다운</b-button>
      <b-table :fields="fields" :items="items" class="list_table" id="bb_list_table">
      </b-table>
    </b-tab>
    <b-tab title="세금계산서(과세)">

      <table width='778' cellpadding='0' cellspacing='0' align='center'>
        <tr>
          <td width='100%'><br><br><br>

        <table id="calcuTable1" width='700' cellpadding='0' cellspacing='0' align='center' class='border_all'>
        <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' height='65' width='100%'><tr>
              <td rowspan='2' align='center' width='360' class='border_tit'><font size='6'><b>세 금 계 산 서</b></font></td>
              <td rowspan='2' width='5' align='center' class='border_tit'><font size='4'><b>[</b></font></td>
              <td rowspan='2' width='70' align='center' class='border_tit'>공급받는자&nbsp;<br>보 &nbsp;관 &nbsp;용&nbsp;</td>
              <td rowspan='2' width='5' align='center' class='border_tit'><font size='4'><b>]</b></font></td>
              <td align='right' width='85' class='border_tit'>책 번 호&nbsp;&nbsp;</td>
              <td colspan='3' align='right' class='border_both'>권 &nbsp;</td>
              <td colspan='4' align='right' class='border_tit'>호 &nbsp;</td>
            </tr>
            <tr>
              <td width='85' align='right' class='border_tit'>일련번호&nbsp;</td>
              <td colspan='1' class='border_back ' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up' width='25'>&nbsp;</td>
              <td colspan='1' class='border_top' width='25'>&nbsp;</td>  <!-- 책,권 -->
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up' align='center' width='17' rowspan='4'>공<br><br><br>급<br><br><br>자</td>
              <td class='border_up' align='center' width='55' height='33'>등록번호</td>
              <td class='border_up' align='center' width='278' colspan='5'>공급자 사업자 번호</td>
              <td class='border_up' align='center' width='17' rowspan='4'>공<br>급<br>받<br>는<br>자</td>
              <td class='border_up' align='center' width='55'>등록번호</td>
              <td class='border_top' align='center' width='278' colspan='5'>공급받는자 사업자 번호</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='55' height='33'>상 호<br>(법인명)</td>
              <td class='border_up' align='center' width='160' colspan='3'>공급자 상호</td>
              <td class='border_up' align='center' width='12' colspan='1'>성<br>명</td>
              <td class='border_up' align='right' width='94' colspan='1'>공급자 이름인</td>
              <td class='border_up' align='center' width='55'>상 호<br>(법인명)</td>
              <td class='border_up' align='center' width='160' colspan='3'>공급받는자 상호</td>
              <td class='border_up' align='center' width='12' colspan='1'>성<br>명</td>
              <td class='border_top' align='right' width='94' colspan='1'>공급받는자 이름인</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='55' height='33'>사업장<br>주  소</td>
              <td class='border_up' align='center' width='278' colspan='5'>공급자 사업장 주소</td>
              <td class='border_up' align='center' width='55'>사업장<br>주  소</td>
              <td class='border_top' align='center' width='278' colspan='5'>공급받는 자 사업장 주소</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='55' height='33'>업  태</td>
              <td class='border_up' align='center' width='148' colspan='1'>공급자 업태</td>
              <td class='border_up' align='center' width='12' colspan='1'>종<br>목</td>
              <td class='border_up' align='center' width='106' colspan='3'>공급자 종목</td>
              <td class='border_up' align='center' width='55'>업 &nbsp; 태</td>
              <td class='border_up' align='center' width='148' colspan='1'>공급받는자 업태</td>
              <td class='border_up' align='center' width='12' colspan='1'>종<br>목</td>
              <td class='border_top' align='center' width='106' colspan='3'>공급받는자 종목</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up' align='center' width='85' height='21'>작 &nbsp; 성</td>
              <td class='border_up' colspan='12' width='250' align='center'>공 &nbsp; 급 &nbsp; 가 &nbsp; 액</td>
              <td class='border_up' rowspan='3' align='center' width='4' height='15'>&nbsp;</td>
              <td class='border_up' colspan='10' align='center' width='190' height='15'>세 &nbsp; 액</td>
              <td class='border_top' align='center' width='156'>비 &nbsp; 고</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='85' height='21'>년 &nbsp; 월 &nbsp; 일</td>
              <td class='border_up' align='center' width='35'><font size='1'>공란수</font></td>
              <td class='border_up' align='center' width='20'>백</td>
              <td class='border_up' align='center' width='20'>십</td>
              <td class='border_up' align='center' width='20'>억</td>
              <td class='border_up' align='center' width='20'>천</td>
              <td class='border_up' align='center' width='20'>백</td>
              <td class='border_up' align='center' width='20'>십</td>
              <td class='border_up' align='center' width='20'>만</td>
              <td class='border_up' align='center' width='20'>천</td>
              <td class='border_up' align='center' width='20'>백</td>
              <td class='border_up' align='center' width='20'>십</td>
              <td class='border_up' align='center' width='20'>일</td>

              <td class='border_up' align='center' width='20'>십</td>
              <td class='border_up' align='center' width='20'>억</td>
              <td class='border_up' align='center' width='20'>천</td>
              <td class='border_up' align='center' width='20'>백</td>
              <td class='border_up' align='center' width='20'>십</td>
              <td class='border_up' align='center' width='20'>만</td>
              <td class='border_up' align='center' width='20'>천</td>
              <td class='border_up' align='center' width='20'>백</td>
              <td class='border_up' align='center' width='20'>십</td>
              <td class='border_up' align='center' width='20'>일</td>
              <td class='border_top' align='center' width='156' rowspan='2'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='85' height='25'> 2019-05-15 </td>
              <td class='border_up' align='center' width='35'>공란수</td>
              <td class='border_up' align='center' width='20'>1</td>
              <td class='border_up' align='center' width='20'>2</td>
              <td class='border_up' align='center' width='20'>3</td>
              <td class='border_up' align='center' width='20'>4</td>
              <td class='border_up' align='center' width='20'>5</td>
              <td class='border_up' align='center' width='20'>6</td>
              <td class='border_up' align='center' width='20'>7</td>
              <td class='border_up' align='center' width='20'>8</td>
              <td class='border_up' align='center' width='20'>9</td>
              <td class='border_up' align='center' width='20'>1</td>
              <td class='border_up' align='center' width='20'>1</td>
            <!--  여기서 부터 세액-->
              <td class='border_up' align='center' width='20'>2</td>
              <td class='border_up' align='center' width='20'>&nbsp;</td>
              <td class='border_up' align='center' width='20'>&nbsp;</td>
              <td class='border_up' align='center' width='20'>&nbsp;</td>
              <td class='border_up' align='center' width='20'>&nbsp;</td>
              <td class='border_up' align='center' width='20'>&nbsp;</td>
              <td class='border_up' align='center' width='20'>&nbsp;</td>
              <td class='border_up' align='center' width='20'>&nbsp;</td>
              <td class='border_up' align='center' width='20'>&nbsp;</td>
              <td class='border_up' align='center' width='20'>&nbsp;</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up' align='center' width='50' height='21'>월 일</td>
              <td class='border_up' align='center' width='195'>품 &nbsp; &nbsp; &nbsp; 목</td>
              <td class='border_up' align='center' width='42'>규 격</td>
              <td class='border_up' align='center' width='65'>수 량</td>
              <td class='border_up' align='center' width='55'>단 가</td>
              <td class='border_up' align='center' width='150'>공급가액</td>
              <td class='border_up' align='center' width='83'>세 액</td>
              <td class='border_top' align='center' width='60'>비고</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='50' height='25'>05-15</td>
              <td class='border_up' align='center' width='195'>품목 넣기</td>
              <td class='border_up' align='center' width='42'>규격 넣기</td>
              <td class='border_up' align='center' width='65'>수량 넣기</td>
              <td class='border_up' align='center' width='55'>단가 넣기</td>
              <td class='border_up' align='center' width='150'>공급가액 넣기</td>
              <td class='border_up' align='center' width='83'>세액 넣기</td>
              <td class='border_top' align='center' width='60'>비고 넣기</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up' align='center' width='195'>&nbsp;</td>
              <td class='border_up' align='center' width='42'>&nbsp;</td>
              <td class='border_up' align='center' width='65'>&nbsp;</td>
              <td class='border_up' align='center' width='55'>&nbsp;</td>
              <td class='border_up' align='center' width='150'>&nbsp;</td>
              <td class='border_up' align='center' width='83'>&nbsp;</td>
              <td class='border_top' align='center' width='60'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up' align='center' width='195'>&nbsp;</td>
              <td class='border_up' align='center' width='42'>&nbsp;</td>
              <td class='border_up' align='center' width='65'>&nbsp;</td>
              <td class='border_up' align='center' width='55'>&nbsp;</td>
              <td class='border_up' align='center' width='150'>&nbsp;</td>
              <td class='border_up' align='center' width='83'>&nbsp;</td>
              <td class='border_top' align='center' width='60'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up' align='center' width='195'>&nbsp;</td>
              <td class='border_up' align='center' width='42'>&nbsp;</td>
              <td class='border_up' align='center' width='65'>&nbsp;</td>
              <td class='border_up' align='center' width='55'>&nbsp;</td>
              <td class='border_up' align='center' width='150'>&nbsp;</td>
              <td class='border_up' align='center' width='83'>&nbsp;</td>
              <td class='border_top' align='center' width='60'>&nbsp;</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr align='justify'>
              <td class='border_up' align='center' width='122' height='2'>합계금액</td>
              <td class='border_up' align='center' width='108'>현 &nbsp; &nbsp; 금</td>
              <td class='border_up' align='center' width='108'>수 &nbsp; &nbsp; 표</td>
              <td class='border_up' align='center' width='108'>어 &nbsp; &nbsp; 음</td>
              <td class='border_up' align='center' width='108'>외상미수금</td>
              <td class='border_top' rowspan='2' align='center' width='143'>이 금액을 &nbsp;  &nbsp; 청구함</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='122' height='25'>합계금액</td>
              <td class='border_up' align='center' width='108'>현금</td>
              <td class='border_up' align='center' width='108'>수표</td>
              <td class='border_up' align='center' width='108'>어음</td>
              <td class='border_up' align='center' width='108'>외상미수금</td>
            </tr>
            </table>
          </td>
          </tr>
        </table>
        <b-btn @click="saveImage('calcuTable1')" variant="success">다운 받기</b-btn>
        <br><br>
        <!------------------------------ 절취선 ------------------------------------------------->
        <table width='700' cellpadding='0' cellspacing='0' align='center'>
          <tr>
              <td height='1' colspan=2 background='<?echo("$skin_dir/dot.gif")?>' border='0'></td>
          </tr>
        </table>
        <!------------------------------ 절취선 ------------------------------------------------->

        <br><br>

        <table width='700' cellpadding='0' cellspacing='0' align='center' class='border_all_red'>
        <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' height='65' width='100%'><tr>
              <td rowspan='2' align='center' width='360' class='border_tit_red'><font size='6'><b>세 금 계 산 서</b></font></td>
              <td rowspan='2' width='5' align='center' class='border_tit_red'><font size='4'><b>[</b></font></td>
              <td rowspan='2' width='70' align='center' class='border_tit_red'>공 &nbsp;급 &nbsp;자&nbsp;<br>보 &nbsp;관 &nbsp;용&nbsp;</td>
              <td rowspan='2' width='5' align='center' class='border_tit_red'><font size='4'><b>]</b></font></td>
              <td align='right' width='85' class='border_tit_red'>책 번 호&nbsp;&nbsp;</td>
              <td colspan='3' align='right' class='border_both_red'>권 &nbsp;</td>
              <td colspan='4' align='right' class='border_tit_red'>호 &nbsp;</td>
            </tr>
            <tr>
              <td width='85' align='right' class='border_tit_red'>일련번호&nbsp;</td>
              <td colspan='1' class='border_back_red ' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up_red' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up_red' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up_red' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up_red' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up_red' width='25'>&nbsp;</td>
              <td colspan='1' class='border_top_red' width='25'>&nbsp;</td>  <!-- 책,권 -->
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up_red' align='center' width='17' rowspan='4'>공<br><br><br>급<br><br><br>자</td>
              <td class='border_up_red' align='center' width='55' height='33'>등록번호</td>
              <td class='border_up_red' align='center' width='278' colspan='5'>&nbsp;</td>
              <td class='border_up_red' align='center' width='17' rowspan='4'>공<br>급<br>받<br>는<br>자</td>
              <td class='border_up_red' align='center' width='55'>등록번호</td>
              <td class='border_top_red' align='center' width='278' colspan='5'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='55' height='33'>상 호<br>(법입명)</td>
              <td class='border_up_red' align='center' width='160' colspan='3'>&nbsp;</td>
              <td class='border_up_red' align='center' width='12' colspan='1'>성<br>명</td>
              <td class='border_up_red' align='right' width='94' colspan='1'>인</td>
              <td class='border_up_red' align='center' width='55'>상 호<br>(법입명)</td>
              <td class='border_up_red' align='center' width='160' colspan='3'>&nbsp;</td>
              <td class='border_up_red' align='center' width='12' colspan='1'>성<br>명</td>
              <td class='border_top_red' align='right' width='94' colspan='1'>인</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='55' height='33'>사업장<br>주  소</td>
              <td class='border_up_red' align='center' width='278' colspan='5'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>사업장<br>주  소</td>
              <td class='border_top_red' align='center' width='278' colspan='5'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='55' height='33'>업  태</td>
              <td class='border_up_red' align='center' width='148' colspan='1'>&nbsp;</td>
              <td class='border_up_red' align='center' width='12' colspan='1'>종<br>목</td>
              <td class='border_up_red' align='center' width='106' colspan='3'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>업 &nbsp; 태</td>
              <td class='border_up_red' align='center' width='148' colspan='1'>&nbsp;</td>
              <td class='border_up_red' align='center' width='12' colspan='1'>종<br>목</td>
              <td class='border_top_red' align='center' width='106' colspan='3'>&nbsp;</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up_red' align='center' width='85' height='21'>작 &nbsp; 성</td>
              <td class='border_up_red' colspan='12' width='250' align='center'>공 &nbsp; 급 &nbsp; 가 &nbsp; 액</td>
              <td class='border_up_red' rowspan='3' align='center' width='4' height='15'>&nbsp;</td>
              <td class='border_up_red' colspan='10' align='center' width='190' height='15'>세 &nbsp; 액</td>
              <td class='border_top_red' align='center' width='156'>비 &nbsp; 고</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='85' height='21'>년 &nbsp; 월 &nbsp; 일</td>
              <td class='border_up_red' align='center' width='35'><font size='1'>공란수</font></td>
              <td class='border_up_red' align='center' width='20'>백</td>
              <td class='border_up_red' align='center' width='20'>십</td>
              <td class='border_up_red' align='center' width='20'>억</td>
              <td class='border_up_red' align='center' width='20'>전</td>
              <td class='border_up_red' align='center' width='20'>백</td>
              <td class='border_up_red' align='center' width='20'>십</td>
              <td class='border_up_red' align='center' width='20'>만</td>
              <td class='border_up_red' align='center' width='20'>천</td>
              <td class='border_up_red' align='center' width='20'>백</td>
              <td class='border_up_red' align='center' width='20'>십</td>
              <td class='border_up_red' align='center' width='20'>일</td>

              <td class='border_up_red' align='center' width='20'>십</td>
              <td class='border_up_red' align='center' width='20'>억</td>
              <td class='border_up_red' align='center' width='20'>전</td>
              <td class='border_up_red' align='center' width='20'>백</td>
              <td class='border_up_red' align='center' width='20'>십</td>
              <td class='border_up_red' align='center' width='20'>만</td>
              <td class='border_up_red' align='center' width='20'>천</td>
              <td class='border_up_red' align='center' width='20'>백</td>
              <td class='border_up_red' align='center' width='20'>십</td>
              <td class='border_up_red' align='center' width='20'>일</td>
              <td class='border_top_red' align='center' width='156' rowspan='2'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='85' height='25'> &nbsp; </td>
              <td class='border_up_red' align='center' width='35'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up_red' align='center' width='50' height='21'>월 일</td>
              <td class='border_up_red' align='center' width='195'>품 &nbsp; &nbsp; &nbsp; 목</td>
              <td class='border_up_red' align='center' width='42'>규 격</td>
              <td class='border_up_red' align='center' width='65'>수 량</td>
              <td class='border_up_red' align='center' width='55'>단 가</td>
              <td class='border_up_red' align='center' width='150'>공급가액</td>
              <td class='border_up_red' align='center' width='83'>세 액</td>
              <td class='border_top_red' align='center' width='60'>비고</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up_red' align='center' width='195'>&nbsp;</td>
              <td class='border_up_red' align='center' width='42'>&nbsp;</td>
              <td class='border_up_red' align='center' width='65'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>&nbsp;</td>
              <td class='border_up_red' align='center' width='150'>&nbsp;</td>
              <td class='border_up_red' align='center' width='83'>&nbsp;</td>
              <td class='border_top_red' align='center' width='60'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up_red' align='center' width='195'>&nbsp;</td>
              <td class='border_up_red' align='center' width='42'>&nbsp;</td>
              <td class='border_up_red' align='center' width='65'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>&nbsp;</td>
              <td class='border_up_red' align='center' width='150'>&nbsp;</td>
              <td class='border_up_red' align='center' width='83'>&nbsp;</td>
              <td class='border_top_red' align='center' width='60'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up_red' align='center' width='195'>&nbsp;</td>
              <td class='border_up_red' align='center' width='42'>&nbsp;</td>
              <td class='border_up_red' align='center' width='65'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>&nbsp;</td>
              <td class='border_up_red' align='center' width='150'>&nbsp;</td>
              <td class='border_up_red' align='center' width='83'>&nbsp;</td>
              <td class='border_top_red' align='center' width='60'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up_red' align='center' width='195'>&nbsp;</td>
              <td class='border_up_red' align='center' width='42'>&nbsp;</td>
              <td class='border_up_red' align='center' width='65'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>&nbsp;</td>
              <td class='border_up_red' align='center' width='150'>&nbsp;</td>
              <td class='border_up_red' align='center' width='83'>&nbsp;</td>
              <td class='border_top_red' align='center' width='60'>&nbsp;</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr align='justify'>
              <td class='border_up_red' align='center' width='122' height='2'>합계금액</td>
              <td class='border_up_red' align='center' width='108'>현 &nbsp; &nbsp; 금</td>
              <td class='border_up_red' align='center' width='108'>수 &nbsp; &nbsp; 표</td>
              <td class='border_up_red' align='center' width='108'>어 &nbsp; &nbsp; 음</td>
              <td class='border_up_red' align='center' width='108'>외상미수금</td>
              <td class='border_top_red' rowspan='2' align='center' width='143'>이 금액을 &nbsp;  &nbsp; &nbsp; &nbsp;함</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='122' height='25'>&nbsp;</td>
              <td class='border_up_red' align='center' width='108'>&nbsp;</td>
              <td class='border_up_red' align='center' width='108'>&nbsp;</td>
              <td class='border_up_red' align='center' width='108'>&nbsp;</td>
              <td class='border_up_red' align='center' width='108'>&nbsp;</td>
            </tr>
            </table>
          </td>
          </tr>
        </table>


        <br><br><br>
        </td>
        </tr>
        </table>
                <!------------------- 세금계산서 태그 여기까지 -------------------->

        </td>
        </tr>
        </table>
    </b-tab>
    <b-tab title="계산서">
      <table width='778' cellpadding='0' cellspacing='0' align='center'>
        <tr>
          <td width='100%'><br><br><br>

        <table width='700' cellpadding='0' cellspacing='0' align='center' class='border_all'>
        <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' height='65' width='100%'><tr>
              <td rowspan='2' align='center' width='360' class='border_tit'><font size='6'><b>계 산 서</b></font></td>
              <td rowspan='2' width='5' align='center' class='border_tit'><font size='4'><b>[</b></font></td>
              <td rowspan='2' width='70' align='center' class='border_tit'>공급받는자&nbsp;<br>보 &nbsp;관 &nbsp;용&nbsp;</td>
              <td rowspan='2' width='5' align='center' class='border_tit'><font size='4'><b>]</b></font></td>
              <td align='right' width='85' class='border_tit'>책 번 호&nbsp;&nbsp;</td>
              <td colspan='3' align='right' class='border_both'>권 &nbsp;</td>
              <td colspan='4' align='right' class='border_tit'>호 &nbsp;</td>
            </tr>
            <tr>
              <td width='85' align='right' class='border_tit'>일련번호&nbsp;</td>
              <td colspan='1' class='border_back ' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up' width='25'>&nbsp;</td>
              <td colspan='1' class='border_top' width='25'>&nbsp;</td>  <!-- 책,권 -->
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up' align='center' width='17' rowspan='4'>공<br><br><br>급<br><br><br>자</td>
              <td class='border_up' align='center' width='55' height='33'>등록번호</td>
              <td class='border_up' align='center' width='278' colspan='5'>공급자 사업자 번호</td>
              <td class='border_up' align='center' width='17' rowspan='4'>공<br>급<br>받<br>는<br>자</td>
              <td class='border_up' align='center' width='55'>등록번호</td>
              <td class='border_top' align='center' width='278' colspan='5'>공급받는자 사업자 번호</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='55' height='33'>상 호<br>(법인명)</td>
              <td class='border_up' align='center' width='160' colspan='3'>공급자 상호</td>
              <td class='border_up' align='center' width='12' colspan='1'>성<br>명</td>
              <td class='border_up' align='right' width='94' colspan='1'>공급자 이름인</td>
              <td class='border_up' align='center' width='55'>상 호<br>(법인명)</td>
              <td class='border_up' align='center' width='160' colspan='3'>공급받는자 상호</td>
              <td class='border_up' align='center' width='12' colspan='1'>성<br>명</td>
              <td class='border_top' align='right' width='94' colspan='1'>공급받는자 이름인</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='55' height='33'>사업장<br>주  소</td>
              <td class='border_up' align='center' width='278' colspan='5'>공급자 사업장 주소</td>
              <td class='border_up' align='center' width='55'>사업장<br>주  소</td>
              <td class='border_top' align='center' width='278' colspan='5'>공급받는 자 사업장 주소</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='55' height='33'>업  태</td>
              <td class='border_up' align='center' width='148' colspan='1'>공급자 업태</td>
              <td class='border_up' align='center' width='12' colspan='1'>종<br>목</td>
              <td class='border_up' align='center' width='106' colspan='3'>공급자 종목</td>
              <td class='border_up' align='center' width='55'>업 &nbsp; 태</td>
              <td class='border_up' align='center' width='148' colspan='1'>공급받는자 업태</td>
              <td class='border_up' align='center' width='12' colspan='1'>종<br>목</td>
              <td class='border_top' align='center' width='106' colspan='3'>공급받는자 종목</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up' align='center' width='85' height='21'>작 &nbsp; 성</td>
              <td class='border_up' colspan='12' width='250' align='center'>공 &nbsp; 급 &nbsp; 가 &nbsp; 액</td>
              <td class='border_up' rowspan='3' align='center' width='4' height='15'>&nbsp;</td>
              <td class='border_top' align='center' width='246'>비 &nbsp; 고</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='85' height='21'>년 &nbsp; 월 &nbsp; 일</td>
              <td class='border_up' align='center' width='35'><font size='1'>공란수</font></td>
              <td class='border_up' align='center' width='20'>백</td>
              <td class='border_up' align='center' width='20'>십</td>
              <td class='border_up' align='center' width='20'>억</td>
              <td class='border_up' align='center' width='20'>천</td>
              <td class='border_up' align='center' width='20'>백</td>
              <td class='border_up' align='center' width='20'>십</td>
              <td class='border_up' align='center' width='20'>만</td>
              <td class='border_up' align='center' width='20'>천</td>
              <td class='border_up' align='center' width='20'>백</td>
              <td class='border_up' align='center' width='20'>십</td>
              <td class='border_up' align='center' width='20'>일</td>
              <td class='border_top' align='center' width='246' rowspan='2'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='85' height='25'> 2019-05-15 </td>
              <td class='border_up' align='center' width='35'>공란수</td>
              <td class='border_up' align='center' width='20'>1</td>
              <td class='border_up' align='center' width='20'>2</td>
              <td class='border_up' align='center' width='20'>3</td>
              <td class='border_up' align='center' width='20'>4</td>
              <td class='border_up' align='center' width='20'>5</td>
              <td class='border_up' align='center' width='20'>6</td>
              <td class='border_up' align='center' width='20'>7</td>
              <td class='border_up' align='center' width='20'>8</td>
              <td class='border_up' align='center' width='20'>9</td>
              <td class='border_up' align='center' width='20'>1</td>
              <td class='border_up' align='center' width='20'>1</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up' align='center' width='50' height='21'>월 일</td>
              <td class='border_up' align='center' width='195'>품 &nbsp; &nbsp; &nbsp; 목</td>
              <td class='border_up' align='center' width='42'>규 격</td>
              <td class='border_up' align='center' width='65'>수 량</td>
              <td class='border_up' align='center' width='55'>단 가</td>
              <td class='border_up' align='center' width='233'>공급가액</td>
              <td class='border_top' align='center' width='60'>비고</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='50' height='25'>05-15</td>
              <td class='border_up' align='center' width='195'>품목 넣기</td>
              <td class='border_up' align='center' width='42'>규격 넣기</td>
              <td class='border_up' align='center' width='65'>수량 넣기</td>
              <td class='border_up' align='center' width='55'>단가 넣기</td>
              <td class='border_up' align='center' width='233'>공급가액 넣기</td>
              <td class='border_top' align='center' width='60'>비고 넣기</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up' align='center' width='195'>&nbsp;</td>
              <td class='border_up' align='center' width='42'>&nbsp;</td>
              <td class='border_up' align='center' width='65'>&nbsp;</td>
              <td class='border_up' align='center' width='55'>&nbsp;</td>
              <td class='border_up' align='center' width='233'>&nbsp;</td>
              <td class='border_top' align='center' width='60'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up' align='center' width='195'>&nbsp;</td>
              <td class='border_up' align='center' width='42'>&nbsp;</td>
              <td class='border_up' align='center' width='65'>&nbsp;</td>
              <td class='border_up' align='center' width='55'>&nbsp;</td>
              <td class='border_up' align='center' width='233'>&nbsp;</td>
              <td class='border_top' align='center' width='60'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up' align='center' width='195'>&nbsp;</td>
              <td class='border_up' align='center' width='42'>&nbsp;</td>
              <td class='border_up' align='center' width='65'>&nbsp;</td>
              <td class='border_up' align='center' width='55'>&nbsp;</td>
              <td class='border_up' align='center' width='233'>&nbsp;</td>
              <td class='border_top' align='center' width='60'>&nbsp;</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr align='justify'>
              <td class='border_up' align='center' width='122' height='2'>합계금액</td>
              <td class='border_up' align='center' width='108'>현 &nbsp; &nbsp; 금</td>
              <td class='border_up' align='center' width='108'>수 &nbsp; &nbsp; 표</td>
              <td class='border_up' align='center' width='108'>어 &nbsp; &nbsp; 음</td>
              <td class='border_up' align='center' width='108'>외상미수금</td>
              <td class='border_top' rowspan='2' align='center' width='143'>이 금액을 &nbsp;  &nbsp; 청구함</td>
            </tr>
            <tr>
              <td class='border_up' align='center' width='122' height='25'>합계금액</td>
              <td class='border_up' align='center' width='108'>현금</td>
              <td class='border_up' align='center' width='108'>수표</td>
              <td class='border_up' align='center' width='108'>어음</td>
              <td class='border_up' align='center' width='108'>외상미수금</td>
            </tr>
            </table>
          </td>
          </tr>
        </table>

        <br><br>
        <!------------------------------ 절취선 ------------------------------------------------->
        <table width='700' cellpadding='0' cellspacing='0' align='center'>
          <tr>
              <td height='1' colspan=2 background='<?echo("$skin_dir/dot.gif")?>' border='0'></td>
          </tr>
        </table>
        <!------------------------------ 절취선 ------------------------------------------------->

        <br><br>

        <table width='700' cellpadding='0' cellspacing='0' align='center' class='border_all_red'>
        <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' height='65' width='100%'><tr>
              <td rowspan='2' align='center' width='360' class='border_tit_red'><font size='6'><b>계 산 서</b></font></td>
              <td rowspan='2' width='5' align='center' class='border_tit_red'><font size='4'><b>[</b></font></td>
              <td rowspan='2' width='70' align='center' class='border_tit_red'>공 &nbsp;급 &nbsp;자&nbsp;<br>보 &nbsp;관 &nbsp;용&nbsp;</td>
              <td rowspan='2' width='5' align='center' class='border_tit_red'><font size='4'><b>]</b></font></td>
              <td align='right' width='85' class='border_tit_red'>책 번 호&nbsp;&nbsp;</td>
              <td colspan='3' align='right' class='border_both_red'>권 &nbsp;</td>
              <td colspan='4' align='right' class='border_tit_red'>호 &nbsp;</td>
            </tr>
            <tr>
              <td width='85' align='right' class='border_tit_red'>일련번호&nbsp;</td>
              <td colspan='1' class='border_back_red ' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up_red' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up_red' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up_red' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up_red' width='25'>&nbsp;</td>
              <td colspan='1' class='border_up_red' width='25'>&nbsp;</td>
              <td colspan='1' class='border_top_red' width='25'>&nbsp;</td>  <!-- 책,권 -->
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up_red' align='center' width='17' rowspan='4'>공<br><br><br>급<br><br><br>자</td>
              <td class='border_up_red' align='center' width='55' height='33'>등록번호</td>
              <td class='border_up_red' align='center' width='278' colspan='5'>&nbsp;</td>
              <td class='border_up_red' align='center' width='17' rowspan='4'>공<br>급<br>받<br>는<br>자</td>
              <td class='border_up_red' align='center' width='55'>등록번호</td>
              <td class='border_top_red' align='center' width='278' colspan='5'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='55' height='33'>상 호<br>(법입명)</td>
              <td class='border_up_red' align='center' width='160' colspan='3'>&nbsp;</td>
              <td class='border_up_red' align='center' width='12' colspan='1'>성<br>명</td>
              <td class='border_up_red' align='right' width='94' colspan='1'>인</td>
              <td class='border_up_red' align='center' width='55'>상 호<br>(법입명)</td>
              <td class='border_up_red' align='center' width='160' colspan='3'>&nbsp;</td>
              <td class='border_up_red' align='center' width='12' colspan='1'>성<br>명</td>
              <td class='border_top_red' align='right' width='94' colspan='1'>인</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='55' height='33'>사업장<br>주  소</td>
              <td class='border_up_red' align='center' width='278' colspan='5'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>사업장<br>주  소</td>
              <td class='border_top_red' align='center' width='278' colspan='5'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='55' height='33'>업  태</td>
              <td class='border_up_red' align='center' width='148' colspan='1'>&nbsp;</td>
              <td class='border_up_red' align='center' width='12' colspan='1'>종<br>목</td>
              <td class='border_up_red' align='center' width='106' colspan='3'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>업 &nbsp; 태</td>
              <td class='border_up_red' align='center' width='148' colspan='1'>&nbsp;</td>
              <td class='border_up_red' align='center' width='12' colspan='1'>종<br>목</td>
              <td class='border_top_red' align='center' width='106' colspan='3'>&nbsp;</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up_red' align='center' width='85' height='21'>작 &nbsp; 성</td>
              <td class='border_up_red' colspan='12' width='250' align='center'>공 &nbsp; 급 &nbsp; 가 &nbsp; 액</td>
              <td class='border_up_red' rowspan='3' align='center' width='4' height='15'>&nbsp;</td>
              <td class='border_top_red' align='center' width='356'>비 &nbsp; 고</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='85' height='21'>년 &nbsp; 월 &nbsp; 일</td>
              <td class='border_up_red' align='center' width='35'><font size='1'>공란수</font></td>
              <td class='border_up_red' align='center' width='20'>백</td>
              <td class='border_up_red' align='center' width='20'>십</td>
              <td class='border_up_red' align='center' width='20'>억</td>
              <td class='border_up_red' align='center' width='20'>전</td>
              <td class='border_up_red' align='center' width='20'>백</td>
              <td class='border_up_red' align='center' width='20'>십</td>
              <td class='border_up_red' align='center' width='20'>만</td>
              <td class='border_up_red' align='center' width='20'>천</td>
              <td class='border_up_red' align='center' width='20'>백</td>
              <td class='border_up_red' align='center' width='20'>십</td>
              <td class='border_up_red' align='center' width='20'>일</td>
              <td class='border_top_red' align='center' width='356' rowspan='2'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='85' height='25'> &nbsp; </td>
              <td class='border_up_red' align='center' width='35'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
              <td class='border_up_red' align='center' width='20'>&nbsp;</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr>
              <td class='border_up_red' align='center' width='50' height='21'>월 일</td>
              <td class='border_up_red' align='center' width='195'>품 &nbsp; &nbsp; &nbsp; 목</td>
              <td class='border_up_red' align='center' width='42'>규 격</td>
              <td class='border_up_red' align='center' width='65'>수 량</td>
              <td class='border_up_red' align='center' width='55'>단 가</td>
              <td class='border_up_red' align='center' width='150'>공급가액</td>
              <td class='border_top_red' align='center' width='60'>비고</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up_red' align='center' width='195'>&nbsp;</td>
              <td class='border_up_red' align='center' width='42'>&nbsp;</td>
              <td class='border_up_red' align='center' width='65'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>&nbsp;</td>
              <td class='border_up_red' align='center' width='233'>&nbsp;</td>
              <td class='border_top_red' align='center' width='60'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up_red' align='center' width='195'>&nbsp;</td>
              <td class='border_up_red' align='center' width='42'>&nbsp;</td>
              <td class='border_up_red' align='center' width='65'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>&nbsp;</td>
              <td class='border_up_red' align='center' width='233'>&nbsp;</td>
              <td class='border_top_red' align='center' width='60'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up_red' align='center' width='195'>&nbsp;</td>
              <td class='border_up_red' align='center' width='42'>&nbsp;</td>
              <td class='border_up_red' align='center' width='65'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>&nbsp;</td>
              <td class='border_up_red' align='center' width='233'>&nbsp;</td>
              <td class='border_top_red' align='center' width='60'>&nbsp;</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='50' height='25'>&nbsp;</td>
              <td class='border_up_red' align='center' width='195'>&nbsp;</td>
              <td class='border_up_red' align='center' width='42'>&nbsp;</td>
              <td class='border_up_red' align='center' width='65'>&nbsp;</td>
              <td class='border_up_red' align='center' width='55'>&nbsp;</td>
              <td class='border_up_red' align='center' width='233'>&nbsp;</td>
              <td class='border_top_red' align='center' width='60'>&nbsp;</td>
            </tr>
            </table>
          </td>
          </tr>
          <tr>
          <td width='100%'>
            <table cellpadding='0' cellspacing='0' width='700'>
            <tr align='justify'>
              <td class='border_up_red' align='center' width='122' height='2'>합계금액</td>
              <td class='border_up_red' align='center' width='108'>현 &nbsp; &nbsp; 금</td>
              <td class='border_up_red' align='center' width='108'>수 &nbsp; &nbsp; 표</td>
              <td class='border_up_red' align='center' width='108'>어 &nbsp; &nbsp; 음</td>
              <td class='border_up_red' align='center' width='108'>외상미수금</td>
              <td class='border_top_red' rowspan='2' align='center' width='143'>이 금액을 &nbsp;  영수함</td>
            </tr>
            <tr>
              <td class='border_up_red' align='center' width='122' height='25'>&nbsp;</td>
              <td class='border_up_red' align='center' width='108'>&nbsp;</td>
              <td class='border_up_red' align='center' width='108'>&nbsp;</td>
              <td class='border_up_red' align='center' width='108'>&nbsp;</td>
              <td class='border_up_red' align='center' width='108'>&nbsp;</td>
            </tr>
            </table>
          </td>
          </tr>
        </table>


        <br><br><br>
        </td>
        </tr>
        </table>
                <!------------------- 세금계산서 태그 여기까지 -------------------->

        </td>
        </tr>
        </table>
    </b-tab>
  </b-tabs>
  </div>

</template>

<script>
import DatePicker2 from './DatePicker2.vue'
import BButils from './service/bb_utils.js'
import xlsx from 'xlsx'
import fileSaver from 'file-saver'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import htmlToImage from 'html-to-image'
import html2canvas from 'html2canvas'
import canvasToImage from 'canvas-to-image'
import Axios from 'axios'
export default {
  name: 'Calculate',
  data () {
    return {
      orderDay:{},
      result_time:[],
      counter:90,
      max:100,
      orderData:null,
      progressive_bar:true,
      input_code:null,
      jumunData:[],
      uniqProduct_code: [],
      fields: [
        { key: 'cancle', label: '취소/환불' },
        { key: 'date', label: '주문일' },
        { key: 'jumun_number', label: '주문번호' },
        { key: 'su', label: '수취인' },
        { key: 'address', label: '주소' },
        { key: 'product_name', label: '상품명' },
        { key: 'cnt', label: '수량' },
        { key: 'gong_price', label: '공급가액' },
        { key: 'delivery_pay', label: '배송비' },
        { key: 'jungsan_price', label: '정산금액' }
      ],
      items: [],
    }
  },
  created() {
  },
  computed: {
    ...mapGetters([
      'getDateData',
      'getUniqCode'
    ])
  },
  methods: {
    ...mapActions([
      'ac_getDateData'
    ]),
    saveImage (id) {
      var node = document.getElementById(id);
      html2canvas(node).then(function(canvas) {
        canvas.setAttribute("id", id + 1 )
        document.body.appendChild(canvas)
        console.log(canvas)
        canvasToImage(id+1, {
          name:'disidie',
          type : 'jpg'
        })
        document.body.removeChild(canvas)
      });
    },
    getDate(date) {
      this.orderDay['date1'] = date
    },

    getDate2(date) {
      this.orderDay['date2'] = date
    },
    getList(code) {
      this.selected_code = code
      this.items = []
      for(var s = 0; s <this.getDateData.length; s++) {
        if(this.selected_code === this.getDateData[s].product_code) {
          if(this.getDateData[s].product_option) {
                this.getDateData[s].product_name = this.getDateData[s].product_option
            }
          this.items.push(this.getDateData[s])
        }
      }
    },
    saveToExcel() {
      var worksheet = xlsx.utils.table_to_book(document.getElementById('bb_list_table'));
      worksheet.Sheets.Sheet1['!ref'] = "A1:K99999"
      worksheet.Sheets.Sheet1['J2'] = {t: "s", v:"공급가액"}
      worksheet.Sheets.Sheet1['J3'] = {t: "s", v:"택배비"}
      worksheet.Sheets.Sheet1['J4'] = {t: "s", v:"총합"}
      worksheet.Sheets.Sheet1['K2'] = {t: "s", v:"1", f:"SUM(G:G)"}
      worksheet.Sheets.Sheet1['K3'] = {t: "s", v:"2", f:"SUM(H:H)"}
      worksheet.Sheets.Sheet1['K4'] = {t: "s", v:"3", f:"K2+k3"}
      var opts = {bookType:'xlsx', bookSST:false, type:'binary'}
      var wbout = xlsx.write(worksheet, opts)
      fileSaver.saveAs(new Blob([this.s2ab(wbout)], {type:'application/octet-stream'}), this.selected_code + '.xlsx')
    },

    s2ab(s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for(var i = 0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    },
  },
  components: {
    DatePicker2
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.progressive_bar{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0, 0, 0, 0.3);z-index:200 }
.progressive_bar p{font-size:32px;font-weight: bold;text-align: center}
.progressive_bar .cont_wrap{position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;width:400px;height:200px}
.border_tit {font-family:굴림, verdana, arial; font-size: 11px;color: #5863C7;}
.border_tit_red {font-family:굴림, verdana, arial; font-size: 11px;color: red;}
.border_up {font-family:굴림, verdana, arial; font-size: 11px;color: #5863C7; border-top-width:1; border-right-width:1; border-bottom-width:1; border-left-width:1; border-color:#5863C7; border-top-style:solid; border-left-style:none; border-right-style:solid; border-bottom-style:none;}
.border_up_red {font-family:굴림, verdana, arial; font-size: 11px;color: red; border-top-width:1; border-right-width:1; border-bottom-width:1; border-left-width:1; border-color:red; border-top-style:solid; border-left-style:none; border-right-style:solid; border-bottom-style:none;}
.border_all {font-family:굴림, verdana, arial; font-size: 11px;color: #5863C7; border-top-width:2; border-right-width:2; border-bottom-width:2; border-left-width:2; border-color:#5863C7; border-top-style:solid; border-left-style:solid; border-right-style:solid; border-bottom-style:solid; }
.border_all_red {font-family:굴림, verdana, arial; font-size: 11px;color: red; border-top-width:2; border-right-width:2; border-bottom-width:2; border-left-width:2; border-color:red; border-top-style:solid; border-left-style:solid; border-right-style:solid; border-bottom-style:solid;}
.border_both {font-family:굴림, verdana, arial; font-size: 11px;color: #5863C7; border-top-width:1; border-right-width:1; border-bottom-width:1; border-left-width:1; border-color:#5863C7; border-top-style:none; border-left-style:solid; border-right-style:solid; border-bottom-style:none;}
.border_both_red {font-family:굴림, verdana, arial; font-size: 11px;color: red; border-top-width:1; border-right-width:1; border-bottom-width:1; border-left-width:1; border-color:red; border-top-style:none; border-left-style:solid; border-right-style:solid; border-bottom-style:none;}
.border_top {font-family:굴림, verdana, arial; font-size: 11px;color: #5863C7; border-top-width:1; border-right-width:1; border-bottom-width:1; border-left-width:1; border-color:#5863C7; border-top-style:solid; border-left-style:none; border-right-style:none; border-bottom-style:none;}
.border_top_red {font-family:굴림, verdana, arial; font-size: 11px;color: red; border-top-width:1; border-right-width:1; border-bottom-width:1; border-left-width:1; border-color:red; border-top-style:solid; border-left-style:none; border-right-style:none; border-bottom-style:none;}
.border_back {font-family:굴림, verdana, arial; font-size: 11px;color: #5863C7; border-top-width:1; border-right-width:1; border-bottom-width:1; border-left-width:1; border-color:#5863C7; border-top-style:solid; border-left-style:solid; border-right-style:solid; border-bottom-style:none;}
.border_back_red {font-family:굴림, verdana, arial; font-size: 11px;color: red; border-top-width:1; border-right-width:1; border-bottom-width:1; border-left-width:1; border-color:red; border-top-style:solid; border-left-style:solid; border-right-style:solid; border-bottom-style:none;}
table td.bg{background-color:greenyellow}
</style>