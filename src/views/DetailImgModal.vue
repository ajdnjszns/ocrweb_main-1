<template>
  <v-dialog
    :value="detailModal"
    @input="detailModal = $event"
    max-width="1400px"
    max-height="1000px"
  >
    <v-card>
      <v-form v-model="valid">
        <v-container>
          <v-layout>
            <v-flex xs12 md6>
              <span style="border-top: 2px solid blue; padding-top: 5px"
                >이미지</span
              >
              <div
                class="d-flex flex-column justify-space-between align-center"
                style="height: 550px; border: 1px solid silver"
              >
                <v-img
                  :aspect-ratio="16/9"
                  :width="500"
                  :src="imgSrc"
                  contain
                ></v-img>
              </div>
            </v-flex>
            <v-flex xs12 md6>
              <!-- text data -->
              <span style="border-top: 2px solid blue; padding-top: 5px"
                >인식결과</span
              >
              <div
                class="d-flex flex-column justify-space-between"
                style="height: 550px; border: 1px solid silver"
              >
                <v-simple-table>
                  <template v-slot:default>
                    <tbody style="vertical-align: middle">
                      <tr>
                        <td style="border-right: 1px solid silver; border-bottom: 1px solid silver">항목</td>
                        <td style="border-right: 1px solid silver; border-bottom: 1px solid silver">결과</td>
                        <td style="border-right: 1px solid silver; border-bottom: 1px solid silver">검출신뢰도</td>
                        <td style="border-right: 1px solid silver; border-bottom: 1px solid silver">인식신뢰도</td>
                      </tr>
                      <tr
                        v-for="item in creditData"
                        :key="item.name"
                        style="border: 1px solid silver"
                      >
                        <td style="border-right: 1px solid silver; border-bottom: 1px solid silver" bgcolor="#dcdcdc">
                          {{ item[0] }}
                        </td>
                        <td style="border-right: 1px solid silver; border-bottom: 1px solid silver">
                          {{ item[1] }}
                        </td>
                        <td style="border-right: 1px solid silver; border-bottom: 1px solid silver">
                          {{ item[2] }}
                        </td>
                        <td style="border-bottom: 1px solid silver">
                          {{ item[3] }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>

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
          <v-card-actions class="justify-center"> </v-card-actions>
        </v-flex>
      </v-layout>
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
    splitedStr:[],
    creditData:[],
    textfile:[]
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
              this.imgArr.push(this.filepath + '/' + this.filename + '_cocr_' + this.lpad(i+1, 4, '0') + '.jpg')
              this.textfile.push(this.filepath + '/' + this.filename + '_cocr_' + this.lpad(i+1, 4, '0') + '_CODE1OCR.txt')


            } else {
              console.log("######## JPG ########",this.filepath + '/' + this.filename)
              this.imgArr.push(this.filepath + this.filepath.substring(this.filepath.lastIndexOf("/"), this.filepath.length))
              console.log(this.filepath + this.filepath.substring(this.filepath.lastIndexOf("/"), this.filepath.length) + "_CODE1OCR.txt")
              this.textfile.push(this.filepath + this.filepath.substring(this.filepath.lastIndexOf("/"), this.filepath.length) + "_CODE1OCR.txt")
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
      axios
        .get(url, {},
        {
          withCredentials:true,
        })
        .then((res) => {
          console.log("####re creditData=>####", this.creditData)
          this.ocrText = res.data
          this.splitedStr = res.data.split("\n");
          this.creditData = [];
          for(let i = 0; i < this.splitedStr.length; i++){
            console.log(this.splitedStr[i])
            this.splitedStr[i] = this.splitedStr[i].replaceAll("\t", "=")
            console.log(this.splitedStr[i])
            if(this.splitedStr[i].includes('id_card_type')){
              this.splitedStr[i] = this.splitedStr[i].replace('id_card_type', '신분증 종별')
            }else if(this.splitedStr[i].includes('company_name')){
              this.splitedStr[i] = this.splitedStr[i].replace('company_name', '상호/법인명')
            }else if(this.splitedStr[i].includes('shop_name')){
              this.splitedStr[i] = this.splitedStr[i].replace('shop_name', '상호명')
            }else if(this.splitedStr[i].includes('name')){
              this.splitedStr[i] = this.splitedStr[i].replace('name', '성명')
            }else if(this.splitedStr[i].includes('jumin_num')){
              this.splitedStr[i] = this.splitedStr[i].replace('jumin_num', '주민번호')
            }else if(this.splitedStr[i].includes('driver_num')){
              this.splitedStr[i] = this.splitedStr[i].replace('driver_num', '운전면허번호')
            }else if(this.splitedStr[i].includes('day_of_brith')){
              this.splitedStr[i] = this.splitedStr[i].replace('day_of_brith', '생년월일')
            }else if(this.splitedStr[i].includes('issue_date')){
              this.splitedStr[i] = this.splitedStr[i].replace('issue_date', '발급일')
            }else if(this.splitedStr[i].includes('cradit_card_num')){
              this.splitedStr[i] = this.splitedStr[i].replace('cradit_card_num', '카드번호')
            }else if(this.splitedStr[i].includes('credit_card_num')){
              this.splitedStr[i] = this.splitedStr[i].replace('credit_card_num', '카드번호')
            }else if(this.splitedStr[i].includes('expiry_date')){
              this.splitedStr[i] = this.splitedStr[i].replace('expiry_date', '유효기간')
            }else if(this.splitedStr[i].includes('biz_lic_type')){
              this.splitedStr[i] = this.splitedStr[i].replace('biz_lic_type', '사업자종별')
            }else if(this.splitedStr[i].includes('biz_lic_num')){
              this.splitedStr[i] = this.splitedStr[i].replace('biz_lic_num', '사업자등록번호')
            }else if(this.splitedStr[i].includes('corp_reg_num')){
              this.splitedStr[i] = this.splitedStr[i].replace('corp_reg_num', '법인등록번호')
            }else if(this.splitedStr[i].includes('approval_num')){
              this.splitedStr[i] = this.splitedStr[i].replace('approval_num', '승인번호')
            }else if(this.splitedStr[i].includes('trading_date')){
              this.splitedStr[i] = this.splitedStr[i].replace('trading_date', '거래일')
            }else if(this.splitedStr[i].includes('total_amount')){
              this.splitedStr[i] = this.splitedStr[i].replace('total_amount', '결제금액')
            }else if(this.splitedStr[i].includes('jumin_card')){
              this.splitedStr[i] = this.splitedStr[i].replace('jumin_card', '주민등록증')
            }

            if(this.splitedStr[i].includes('driver_card')){
              this.splitedStr[i] = this.splitedStr[i].replace('driver_card', '운전면허증')
            }if(this.splitedStr[i].includes('welfare_card')){
              this.splitedStr[i] = this.splitedStr[i].replace('welfare_card', '복지카드')
            }if(this.splitedStr[i].includes('alien_card')){
              this.splitedStr[i] = this.splitedStr[i].replace('alien_card', '외국인등록증')
            }if(this.splitedStr[i].includes('overseas_card')){
              this.splitedStr[i] = this.splitedStr[i].replace('overseas_card', '국내거소신고증')
            }
            if(this.splitedStr[i].split("=").length != 1){
              this.creditData.push(this.splitedStr[i].split("="));
            }
          }
          console.log("creditData=>", this.creditData)
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
