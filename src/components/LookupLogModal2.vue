<!-- 일반문서 -->
<template>
    <v-dialog
      class="detail-Modal"
      :value="detailModal"
      @input="detailModal = $event"
      max-width="1200px"
    >
      <v-card>
        <v-form v-model="valid">
          <v-container>
            <v-layout>
              <v-flex xs12 md6>
                <span style="border-top: 2px solid blue; padding-top: 5px">
                  이미지
                </span>
                <div class="pa-0 d-flex">
                  <v-card-actions>
                    <v-row
                      mr-auto
                      p-1
                      align="center"
                      justify="center"
                      style="margin-bottom: -2.5em; margin-top: -3em"
                    >
                      <v-btn
                        class="mx-0"
                        fab
                        dark
                        x-small
                        color="primary"
                        @click="imageSelect('first')"
                      >
                        <v-icon dark> mdi-chevron-double-left </v-icon>
                      </v-btn>
                      <v-btn
                        class="mx-1"
                        fab
                        dark
                        x-small
                        color="primary"
                        @click="imgChange(-1)"
                      >
                        <v-icon dark> mdi-chevron-left </v-icon>
                      </v-btn>
                      <v-text-field
                        class="page-input"
                        v-model="imgIdx"
                      ></v-text-field>
                      <v-text-field
                        class="dash-input"
                        disabled
                        suffix="/"
                      ></v-text-field>
  
                      <v-text-field
                        class="centered-input"
                        v-model="maxPage"
                        readonly
                      ></v-text-field>
                      <v-btn
                        class="mx-0"
                        fab
                        dark
                        x-small
                        color="primary"
                        @click="imageSelect('')"
                        >이동
                      </v-btn>
                      <v-btn
                        class="mx-1"
                        fab
                        dark
                        x-small
                        color="primary"
                        @click="imgChange(1)"
                      >
                        <v-icon dark> mdi-chevron-right </v-icon>
                      </v-btn>
                      <v-btn
                        class="mx-0"
                        fab
                        dark
                        x-small
                        color="primary"
                        @click="imageSelect('last')"
                      >
                        <v-icon dark> mdi-chevron-double-right </v-icon>
                      </v-btn>
                      <v-btn
                        class="mx-1"
                        fab
                        dark
                        x-small
                        color="primary"
                        @click="imgResize(10)"
                      >
                        <v-icon dark> mdi-magnify-plus-outline </v-icon>
                      </v-btn>
                      <v-btn
                        class="mx-0"
                        fab
                        dark
                        x-small
                        color="primary"
                        @click="imgResize(-10)"
                      >
                        <v-icon dark> mdi-magnify-minus-outline </v-icon>
                      </v-btn>
                      <div class="my-15"></div>
                    </v-row>
                  </v-card-actions>
                </div>
                <div
                  class="d-flex flex-column justify-space-between align-center"
                  style="height: 550px; border: 1px solid silver"
                >
                  <v-img
                    :aspect-ratio="1"
                    :width="width"
                    :src="imgSrc"
                    contain
                  ></v-img>
                </div>
              </v-flex>
              <v-flex xs12 md6>
                <span span style="border-top: 2px solid blue; padding-top: 5px"
                  >인식결과</span
                >
                <div class="pa-6 d-flex"></div>
                <div
                  class="d-flex flex-column justify-space-between"
                  style="height: 550px; border: 1px solid silver"
                >
                  <v-textarea v-model="ocrText" name="ocrText" disabled>
                  </v-textarea>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
          <!-- 하단 -->
          <v-layout>
            <v-flex xs12 md6>
              <!--  -->
            </v-flex>
            <v-flex xs12 md6>
              <v-card-actions class="justify-center">
                <v-btn @click.stop="detailModal = false"> 닫기 </v-btn>
              </v-card-actions>
            </v-flex>
            <v-flex xs12 md6>
              <!--  -->
              <v-card-actions class="justify-center">
                <v-spacer></v-spacer>
                <a color="primary" :href="curTextFile" download>
                  <v-icon color="blue" x-large> mdi-file-download </v-icon>
                </a>
                <span style="font-size: 0.7em">텍스트 다운로드</span>
              </v-card-actions>
            </v-flex>
          </v-layout>
          <!-- 하단 끝 -->
        </v-form>
      </v-card>
    </v-dialog>
  </template>
  
  <script>

  import 'viewerjs/dist/viewer.css'
  import axios from 'axios'
  
  export default {
    data: () => ({
      valid: false,
      firstname: '',
      lastname: '',
      width : 300,
      imgArr:[], //이미지 배열
      imgIdx:1,
      imgSrc:"",
      maxPage:3,
      ocrText:"",
      textfile:[],
      curTextFile:""
    }),
    props: {
      value: {
        type: Boolean,
        required: true,
      },
      pagecnt:{
        type: Number
      },
      filepath:{
        type: String
      },
      filename: {
        type: String
      }
    },
    computed: {
      detailModal: {
        get(){
          if(this.filename){
            this.imgArr = [];
            this.textfile = [];
            for(let i = 0; i < this.pagecnt; i++){
              if(this.filename.indexOf('.pdf') > 0){
                console.log("######## PDF ######## ", this.filepath + '/' + this.filename.substring(0, this.filename.lastIndexOf(".")) + '_cocr_' + this.lpad(i+1, 4, '0') + '.jpg')
                this.imgArr.push(this.filepath + '/' + this.filename.substring(0, this.filename.lastIndexOf(".")) + '_cocr_' + this.lpad(i+1, 4, '0') + '.jpg')
                console.log(this.filepath + '/' + this.filename.substring(0, this.filename.lastIndexOf(".")) + '_cocr_' + this.lpad(i+1, 4, '0') + '_CODE1OCR.txt')
                this.textfile.push(this.filepath + '/' + this.filename.substring(0, this.filename.lastIndexOf(".")) + '_cocr_' + this.lpad(i+1, 4, '0') + '_CODE1OCR.txt')
              } else {
                console.log("######## JPG ########",this.filepath + '/' + this.filename)
                this.imgArr.push(this.filepath + '/' + this.filename )
                console.log(this.filepath + '/' + this.filename.substring(0, this.filename.lastIndexOf(".")) + "_CODE1OCR.txt")
                this.textfile.push(this.filepath + '/' + this.filename.substring(0, this.filename.lastIndexOf(".")) + "_CODE1OCR.txt")
              }
            }
            this.maxPage = this.pagecnt
            this.imageSelect('first');
          }
          return this.value
        },
        set(value) {
          this.$emit('input', value);
        }
      }
    },
  
    methods: {
      imgResize(val){
        if(this.width < 100 && val < 0){
          return
        } else if (this.width > 600 && val > 0){
          return
        } else {
          this.width += val;
        }
      },
      imgChange(val){
        this.imgIdx+=val
        if(this.imgIdx > this.maxPage){
          this.imgIdx = this.maxPage;
          this.imageSelect('last')
        } else if (this.imgIdx <= 0) {
          this.imgIdx = 1;
          this.imageSelect('first')
        } else {
          this.imageSelect(this.imgIdx-1)
        }
      },
      imageSelect(idx){
        if(idx=='first'){
          this.imgIdx = 1;
          this.imgSrc = this.imgArr[0]
          this.getText(this.textfile[0]);
        } else if (idx=='last'){
          this.imgIdx = this.imgArr.length;
          this.imgSrc = this.imgArr[this.imgArr.length-1]
          this.getText(this.textfile[this.imgArr.length-1]);
        } else if (idx != '') {
          this.imgSrc = this.imgArr[idx]
          this.getText(this.textfile[idx]);
        } else{
          if(this.imgIdx > this.maxPage){
            this.imgIdx = this.maxPage
          }
          this.imgSrc = this.imgArr[this.imgIdx -1];
          this.getText(this.textfile[this.imgIdx -1]);
        }
      },
      lpad(str, padLen, padStr){
        if (padStr.length > padLen) {
            console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
            return str;
        }
        str += ""; // 문자로
        padStr += ""; // 문자로
        while (str.length < padLen)
            str = padStr + str;
        str = str.length >= padLen ? str.substring(0, padLen) : str;
        return str;
      },
      getText(url){
        this.curTextFile = url;
        axios
          .get(url, {},
          {
            withCredentials:true,
          })
          .then((res) => {
            this.ocrText = res.data
        })
        .catch((error) => {
          console.log("error:",error);
        })
        .finally(() => {
          console.log("finally");
        })
      }
    }
  }
  </script>
  <style>
  ul {
    list-style: none;
  }
  
  li {
    float: left;
  }
  a {
    text-decoration: none;
  }
  textarea {
    height: 532px;
  }
  .page-input input {
    width: 20px;
    text-align: center;
    border: 1px solid;
  }
  .centered-input input {
    width: 20px;
    text-align: center;
  }
  .dash-input input {
    width: 1px;
    text-align: right;
  }
  .detail-Modal v-dialog {
    overflow-y: inherit !important;
  }
  </style>
  