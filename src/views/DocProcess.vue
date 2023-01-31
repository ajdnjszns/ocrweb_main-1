<template>
  <v-container class="pa-13 mb-13">
    <v-row>
      <v-col sm="4" class="ma-4">
        <h2>처리 현황</h2>
      </v-col>
    </v-row>
    <v-row class="ml-1">
      <!-- 파일명 -->
      <v-col cols="2">
        <v-text-field v-model="searchFileName" label="파일명" outlined dense>
        </v-text-field>
      </v-col>
      <!-- 문서형식  -->
      <v-col cols="2">
        <v-select
          
          v-model="ocrmedia_id"
          :items="searchOcrIdItems"
          item-text="type"
          item-value="format"
          label="문서형식"
          outlined
          return-object
          dense
        >
        </v-select>
      </v-col>
      
      <!-- 등록일 시작 -->
      <v-col cols="2">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="date-field"
              v-model="s_date"
              label="등록일"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              dense
            ></v-text-field>
          </template>
          <v-date-picker v-model="s_date" @input="menu = false"></v-date-picker>
        </v-menu>
      </v-col>
      <b-button
        :disabled="true"
        variant="transparent"
        style="margin-top: 0.5em; margin-left: 0.2em"
        >~</b-button
      >
      <!-- 등록일 종료 -->
      <v-col cols="2">
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="date-field"
              label="종료일"
              v-model="e_date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              dense
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="e_date"
            @input="menu2 = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <!-- 검색버튼  -->
      <v-col>
      <v-btn class="mb-3" color="primary" @click="getData" ref="search">
        <span>검색</span>
      </v-btn>
      </v-col>
    </v-row>

    <!-- OCR 처리/처리완료 -->
    <v-row>
      <v-col>
        <div class="d-flex mx-4">
          <v-img
            left
            max-height="20"
            max-width="20"
            src="../assets/progress.png"
          ></v-img>
          <span> :OCR 처리 중 | </span>
          <v-img
            max-height="20"
            max-width="20"
            src="../assets/done.png"
          ></v-img>
          <span> :OCR 처리완료 </span>
        </div>
      </v-col>
      <v-col> </v-col>
      <!-- 파일 업로드 -->
      <!-- 참고: https://vuetifyjs.com/en/components/dialogs/#loader -->
      <!-- 종류: Nesting -->
      <v-btn class="mx-6" color="primary" dark @click.stop="dialog = true">
        <!-- dialog 1 -->
        <v-dialog
          :value="dialog"
          @input="dialog = $event"
          max-width="500px"
          ref="form"
        >
          <v-card>
            <v-card-title> 파일업로드 {{ }}</v-card-title>
            <v-card-text>
              <v-select
                v-model="select"
                :items="doc_type_items"
                item-text="type"
                item-value="format"
                label="문서종류"
                return-object
                dense
                outlined
              ></v-select>
              <!-- imgFile -->
              <v-file-input
                v-model="imgFile"
                accept=".jpg,.tif,.tiff,.png,.bmp,.pdf"
                label="파일 선택"
              ></v-file-input>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="primary" text @click="upload_btn"> 업로드 </v-btn>
              <v-btn color="primary" text @click="dialog = false">닫기 </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- dialog 1 end -->
        <v-icon left>mdi-cloud-upload</v-icon>
        <span>파일 업로드</span>
      </v-btn>
      <!-- 파일업로드 끝 -->

      <DetailModal
        v-model="detailModal"
        :pagecnt="pagecnt"
        :filepath="filepath"
        :filename="filename"
      >
      </DetailModal>
      <DetailImgModal
        v-model="detailImgModal"
        :pagecnt="pagecnt"
        :filepath="filepath"
        :filename="filename"
      >
      </DetailImgModal>
    </v-row>

    <!-- 데이터 테이블 -->
    <!-- 참고: https://vuetifyjs.com/en/components/data-tables/#misc -->
    <!-- 종류: Row Selection -->
    <v-col>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="items"
        item-key="seq"
        show-select
        class="elevation-1"
        @click:row="show"
      >
        <template v-slot:item.status="{ item }">
          <v-img
            max-height="20"
            max-width="20"
            :src="getImage(item.status)"
          ></v-img>
        </template>
      </v-data-table>
    </v-col>
    <v-row>
      <v-btn class="ma-6" color="primary" @click="deleteDoc">
        <span>선택삭제</span>
      </v-btn>
      <v-dialog v-model="period" scrollable max-width="300px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="ma-6" color="primary" dark v-bind="attrs" v-on="on">
            <span>보관기간변경</span>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>보관기간</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 150px">
            <v-radio-group v-model="period_dialog" column>
              <v-radio label="1개월" value="1"></v-radio>
              <v-radio label="3개월" value="3"></v-radio>
              <v-radio label="6개월" value="6"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click.stop="period = false">
              닫기
            </v-btn>
            <v-btn color="blue darken-1" text @click="periodChange">
              변경
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import UploadComponent from './UploadForm.vue'
import DetailModal from './DetailModal.vue'
import DetailImgModal from './DetailImgModal.vue'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
data: () => ({
  interval:null,
  imgFile: null,
  showUploadForm: false,
  //팝업
  dialog: false,  //업로드팝업
  detailModal: false,
  detailImgModal: false,
  period_dialog: false,
  //조회조건
  searchFileName: "",
  ocrmedia_id: {type: '전체', value:""},
  searchOcrIdItems: [],
  //시작일, 종료일 속성
  s_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
  e_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
  //selection menu
  select: {type: '일반문서', format: 'full_text'},
  doc_type_items: [],
  //팝업
  menu: false,  //시작일
  menu2: false, //종료일
  period: false,  //보관기간 변경 팝업

  //Data table 속성
  singleSelect: false,
  selected: [],
  headers: [
    { text: '파일명', align:'start', sortable: false, value: 'filename'},
    { text: '문서형식', value: 'ocrmedia_id' },
    { text: '총페이지수', value: 'page_cnt' },
    { text: 'OCR', value: 'status' },
    { text: '등록일', value: 'reg_date' },
    { text: '보관만료일', value: 'keep_expire_date' },
  ],
  items: [],
  b_items: [],
  pagecnt:0,
  filepath:'',
  filename:'',
  user_id:''
}),

methods: {
  getImage(stauts){ //OCR 상태 아이콘 Load
      console.log("img : " + stauts);
      var rtn = "";
      var images = require.context('../assets/', false, /\.png$/)
      if(stauts == 99){
        return images('./' + "done.png")
      } else {
        return images('./' + "progress.png")
      }

      return rtn;
  },

  show(event, {item}) {//뷰어 show
    var nowDate = new Date();
    nowDate = nowDate.getFullYear().toString() +"-"+ (nowDate.getMonth() + 1).toString().padStart(2, '0') + "-" + nowDate.getDate().toString().padStart(2,'0');
    console.log(nowDate);
    console.log(item.keep_expire_date)
    if(item.keep_expire_date < nowDate){
      console.log("striung")
      return false;
    }

    this.pagecnt = item.page_cnt
    this.filepath = item.webfilepath
    this.filename = item.filename
    if(item.ocrmedia_id == "일반문서"){
      this.detailModal=true;
    } else {
      this.detailImgModal=true;
    }
  },

  getData(){  //검색 함수
    console.log('getData=>', this.ocrmedia_id.value);
    axios
      .get("/ocr/document",{
        params:{
          "e_date": this.e_date,
          "s_date": this.s_date,
          "filename": this.searchFileName,
          "ocrmedia_id": this.ocrmedia_id.value
        }
      })
      .then((res) => {
        var b_items = res.data;

        for(var i = 0; i < res.data.length; i++){
          if(res.data[i].ocrmedia_id.includes('CODE1PRI')){
            b_items[i].ocrmedia_id = '개인정보'
          }else if(res.data[i].ocrmedia_id.includes('CODE1FIN')){
            b_items[i].ocrmedia_id = '지문정보'
          }else if(res.data[i].ocrmedia_id.includes('CODE1WRP')){
            b_items[i].ocrmedia_id = '일반문서'
          }else if(res.data[i].ocrmedia_id.includes('CODE1IDS')){
            b_items[i].ocrmedia_id = '신분증'
          }else if(res.data[i].ocrmedia_id.includes('CODE1PAS')){
            b_items[i].ocrmedia_id = '여권'
          }else if(res.data[i].ocrmedia_id.includes('CODE1CRD')){
            b_items[i].ocrmedia_id = '신용카드'
          }else if(res.data[i].ocrmedia_id.includes('CODE1CAR')){
            b_items[i].ocrmedia_id = '자동차번호판'
          }else if(res.data[i].ocrmedia_id.includes('CODE1ODO')){
            b_items[i].ocrmedia_id = '자동차주행거리'
          }else if(res.data[i].ocrmedia_id.includes('CODE1GAS')){
            b_items[i].ocrmedia_id = '가스미터계량기'
          }else if(res.data[i].ocrmedia_id.includes('CODE1BUL')){
            b_items[i].ocrmedia_id = '사업자등록증'
          }else if(res.data[i].ocrmedia_id.includes('CODE1REC')){
            b_items[i].ocrmedia_id = '영수증'
          }else if(res.data[i].ocrmedia_id.includes('CODE1POR')){
            b_items[i].ocrmedia_id = '우편물반송'
          }else if(res.data[i].ocrmedia_id.includes('CODE1PWM')){
            b_items[i].ocrmedia_id = '전력계량기'
          }
        }

        this.items = b_items;
        //https://v15.vuetifyjs.com/ko/components/data-tables/ 아이콘
        let isProgress = false;
        for(var i = 0; i < res.data.length; i++){
          if(res.data[i].status == 0){
            console.log('res.data[i].status', res.data[i].status)
            isProgress = true;
            break;
          }
        }
        if(!isProgress){
          console.log('InterVal 종료')
          clearInterval(this.interval);
        }
      })
      .catch((error) => {
        alert('권한이 없습니다');
      })
      .finally(() => {
        console.log('finally')
      })
  },

  getInitData(){  //검색 함수
    axios
    .get("/ocr/document")
      .then((res) => {

        var b_items = res.data;

        for(var i = 0; i < res.data.length; i++){
          if(res.data[i].ocrmedia_id.includes('CODE1PRI')){
            b_items[i].ocrmedia_id = '개인정보'
          }else if(res.data[i].ocrmedia_id.includes('CODE1FIN')){
            b_items[i].ocrmedia_id = '지문정보'
          }else if(res.data[i].ocrmedia_id.includes('CODE1WRP')){
            b_items[i].ocrmedia_id = '일반문서'
          }else if(res.data[i].ocrmedia_id.includes('CODE1IDS')){
            b_items[i].ocrmedia_id = '신분증'
          }else if(res.data[i].ocrmedia_id.includes('CODE1PAS')){
            b_items[i].ocrmedia_id = '여권'
          }else if(res.data[i].ocrmedia_id.includes('CODE1CRD')){
            b_items[i].ocrmedia_id = '신용카드'
          }else if(res.data[i].ocrmedia_id.includes('CODE1CAR')){
            b_items[i].ocrmedia_id = '자동차번호판'
          }else if(res.data[i].ocrmedia_id.includes('CODE1ODO')){
            b_items[i].ocrmedia_id = '자동차주행거리'
          }else if(res.data[i].ocrmedia_id.includes('CODE1GAS')){
            b_items[i].ocrmedia_id = '가스미터계량기'
          }else if(res.data[i].ocrmedia_id.includes('CODE1BUL')){
            b_items[i].ocrmedia_id = '사업자등록증'
          }else if(res.data[i].ocrmedia_id.includes('CODE1REC')){
            b_items[i].ocrmedia_id = '영수증'
          }else if(res.data[i].ocrmedia_id.includes('CODE1POR')){
            b_items[i].ocrmedia_id = '우편물반송'
          }else if(res.data[i].ocrmedia_id.includes('CODE1PWM')){
            b_items[i].ocrmedia_id = '전력계량기'
          }
        }

        this.items = b_items;
        let isProgress = false;
        for(var i = 0; i < res.data.length; i++){
          // console.log("data : :");
          // console.log(res.data[i].status);
          if(res.data[i].status == 0){
            console.log('res.data[i].status', res.data[i].status)
            isProgress = true;
            break;
          }
        }
        if(!isProgress){
          console.log('InterVal 종료')
          clearInterval(this.interval);
        }
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
      })
  },

  periodChange(){ //기간변경 함수
    axios
      .get("/ocr/updatePeriod",{
        params:{
          doc_keep_period: this.period_dialog
        }
      })
      .then((res) => {
        this.getData();
        this.period = false;
      })
      .catch((error) => {
        console.log("error");
        console.log("error:",error);
      })
      .finally(() => {
        console.log("finally");
      })
  },

  deleteDoc(){  //선택삭제 함수
    var seqArr = "";
    for(var i = 0; i < this.selected.length; i++){
      seqArr += this.selected[i].seq + ",";
    }
    console.log(seqArr);
    if(confirm("삭제하시겠습니까?")){
      axios
      .get("/ocr/deleteDoc",{
        params:{
          seqArr: seqArr
        }
      })
      .then((res) => {
        this.getData();
      })
      .catch((error) => {
        console.log("error");
        console.log("error:",error);
      })
      .finally(() => {
        console.log("finally");
      })
    }
  },

  upload_btn(){  //upload 함수  code1ocr_document
    var fd = new FormData();
    var params = {
            "ocr_filepath": this.e_date,
            "ocr_system_id": 'OCR_WEB',
            "ocr_user_id": this.user_id,
            "ocr_mediaName": this.select.type,
            "ocr_result_format":this.select.format,
            "file_name": this.imgFile.name,
            "binary": this.imgFile
          }
          console.log("params :  " + params)
          console.log(params)
      axios
        .post("/ocr/uploadDoc", params, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        .then((res) => {
          this.uploadApi(res.data);
          this.getData();
          this.dialog = false;
        })
        .catch((error) => {
          console.log("error");
          console.log("error:",error);
        })
        .finally(() => {
          console.log("finally");
        })
    },

    uploadApi(data){
      let params = data;
      console.log("Upload API 호출");
      console.log(params);
      params = {
            "uuid":params.uuid,
            "ocr_filepath": params.ocr_filepath,
            "ocr_system_id": 'OCR_WEB',
            "ocr_user_id": 'admin',
            "ocr_result_format":params.ocr_result_format,
            "ocr_doc_type":params.ocr_doc_type,
          }
      console.log("upload api params:", params)
      axios
        .post("/code1-api/image-ocr", params, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        .then((res) => {
          console.log("성공");
        })
        .catch((error) => {
          console.log("error:",error);
        })
        .finally(() => {
          console.log("finally");
        })
    },

    getPeriod(){  //보관기간 Select 함수
      axios
      .get("/ocr/period")
      .then((res) => {
        console.log("period ::: " + res.data)
        this.period_dialog = res.data.toString();
        this.getOcrMediaId();
      })
      .catch((error) => {
        console.log("error:",error);
        alert('권한이 없습니다');
      })
      .finally(() => {
        console.log("finally");
      })
    },

    getOcrMediaId(){  //문서형식 Select
      axios
      .get("/ocr/ocrmediaid")
      .then((res) => {
        console.log("getOcrMediaId ::: " + res.data)
        console.log(res.data);
        this.searchOcrIdItems = []
        this.searchOcrIdItems.push({type:'전체', value:""})
        for(var item of res.data){
          console.log(item);
          this.searchOcrIdItems.push(item);
        }
        this.doc_type_items = res.data;
        this.getInitData();
        this.interval = setInterval(() => {this.getInitData()}, 10000)
      })
      .catch((error) => {
        console.log("error:",error);
      })
      .finally(() => {
        console.log("finally");
      })
    }
},
computed: {
    // store/index.js state항목을 가져옴
    ...mapState(["ocr_user_id"]),
  },
components: {
  DetailModal,  //상세 페이지 일반문서
  DetailImgModal, //상세 페이지 일반문서 외
  UploadComponent //업로드 창
},
beforeMount(){
  // DB에 저장된 보관기간을 가져온다.
  // 보관기간을 가져오면서 OCR Status 체크하여 상태창을 변경한다.
  this.getPeriod()
  console.log("before mount")
  
},
watch: {
  //업로드 dialog rest
  //참고 https://codepen.io/taditdash/pen/dyGbZjB
  dialog: function(val) {
      if(val) {
        this.select = '개인정보'
        this.imgFile = null
      }
    }
  }
};
</script>
<style lang="css" scoped>
/* 목록 링크 마우스 Pointer css */
.elevation-1 >>> tbody tr :hover {
  cursor: pointer;
}
/* 시작일/종료일 css */
.v-text-field {
  padding-top: 0;
}
</style>
