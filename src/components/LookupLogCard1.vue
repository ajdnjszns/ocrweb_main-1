<template>
  <!-- 행 클릭 시 모달창 -->
  <v-card>
    <LookupLogModal1
      v-model="detailModal"
      :pagecnt="pagecnt"
      :filepath="filepath"
      :filename="filename"
    >
    </LookupLogModal1>
    <LookupLogModal2
      v-model="detailImgModal"
      :pagecnt="pagecnt"
      :filepath="filepath"
      :filename="filename"
    >
    </LookupLogModal2>
    <!-- 데이터 테이블 -->
    <v-data-table
      :headers="headers"
      :items="result"
      :page.sync="page"
      :items-per-page="itemPerPage"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"
      dense
      @click:row="show"
    >
    </v-data-table>
    <!-- 페이지 네비게이션 영역-->
    <v-row justify="center">
      <v-spacer></v-spacer>
      <!-- 10페이지 단위로 앞으로 가기 버튼 -->
      <v-col cols="auto" class="mt-4">
        <v-btn
          elevation="1"
          small
          text
          outlined
          plain
          @click="gotoStart"
          v-bind:disabled="page == 1"
          ><v-icon>mdi-chevron-double-left</v-icon></v-btn
        >
      </v-col>
      <!-- 1페이지 씩 이동 이동 -->
      <v-col cols="4">
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </v-col>
      <!-- 10페이지 단위로 뒤로가기 & 페이징 처리 버튼 -->
      <v-col cols="auto" class="mt-4">
        <v-btn elevation="1" small text outlined plain @click="pagingNext"
          ><v-icon>mdi-chevron-double-right</v-icon></v-btn
        >
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-card>
</template>

<script>
import axios from "axios";
import LookupLogModal1 from "./LookupLogModal1.vue";
import LookupLogModal2 from "./LookupLogModal2.vue";

const baseurl = "/Code1OcrWeb/log/list";

export default {
  computed() {},
  beforeCreate() {},
  created() {},
  props: ["keyword"], //부모 컴포넌트 데이터 가져옴(검색 키워드)
  watch: {
    // 검색 새로 할때마다 메소드 실행
    keyword() {
      this.result.splice(0);
      this.pageReset();
      this.getData();
    },
  },
  data: () => ({
    filepath: "",
    filename: "",
    sign: 0,
    result: [],
    detailModal: false,
    detailImgModal: false,
    page: 1,
    pagecnt: 0,
    pageCount: 0,
    itemPerPage: 10,
    headers: [
      {
        text: "작업일시",
        align: "start",
        value: "reg_date",
      },
      { text: "시스템", value: "ifsystem_id" },
      { text: "파일명", value: "filename" },
      { text: "문서형식", value: "ocrmedia_id" },
      { text: "상태", value: "err_code" },
      { text: "ID", value: "user_id" },
      { text: "성명", value: "name" },
      { text: "직급", value: "position" },
      { text: "부서", value: "organization" },
      { text: "쪽수", value: "page_cnt" },
    ],
    pagingcount: 1,
  }),
  setup() {},
  mounted() {
    // 페이지 처음 로드 시 전체 데이터 출력
    this.getAll();
  },
  unmounted() {},
  beforeMount() {},
  methods: {
    // 행 클릭 시 해당 데이터 정보 모달창 띄우기
    show(event, { item }) {
      this.pagecnt = item.page_cnt;
      item.filepath = item.filepath.replace(/\\/g, '/')
      var str = item.filepath.indexOf('output')
      var path = '/'+ item.filepath.substring(str)
      var name = path.lastIndexOf('/')
      this.filepath = path;
      this.filename = path.substring(name+1);
      if (item.ocrmedia_id == "일반문서") {
        this.detailImgModal = true;
      } else {
        this.detailModal = true;
      }
    },
    // 페이징 처리 리셋
    pageReset() {
      this.pagingcount = 1;
    },
    gotoStart() {
      if (this.page <= 0) {
        this.page = 1;
      }
      this.page -= 10;
    },
    countUp() {
      this.pagingcount++;
    },
    //다음 페이지 불러오기
    pagingNext() {
      if (this.sign == 0) {
        this.countUp();
        this.getAll();
        this.page += 10;
      } else {
        this.countUp();
        this.getData();
        this.page += 10;
      }
    },
    axiosGet() {
      this.sign = 1;
      axios
        .get(baseurl, {
          params: {
            filename: this.keyword[0],
            ocrmedia_id: this.keyword[1],
            ifsystem_id: this.keyword[2],
            start_date: this.keyword[3][0],
            end_date: this.keyword[3][1],
            user_name: this.keyword[4],
            organization: this.keyword[5],
            user_id: this.keyword[6],
            err_code: this.keyword[7],
            page: this.pagingcount,
          },
        })
        .then((res) => {
          console.log(res.data);
          for (var i = 0; i < res.data.length; i++) {
            this.result.push(res.data[i]);
          }
          this.refactor();
        });
    },
    getData() {
      this.getKeyword();
      this.axiosGet();
    },
    getAll() {
      this.sign = 0;
      axios.get(baseurl, { params: { page: this.pagingcount } }).then((res) => {
        console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
          this.result.push(res.data[i]);
        }
        this.refactor();
      });
    },
    getKeyword() {
      if (this.keyword[2] == "OCR웹") {
        this.keyword[2] = "SYS01";
      } else if (this.keyword[2] == "사이버지점 안드로이드") {
        this.keyword[2] = "SYS02";
      } else if (this.keyword[2] == "사이버지점 iOS") {
        this.keyword[2] = "SYS03";
      } else if (this.keyword[2] == "사이버지점 서버") {
        this.keyword[2] = "SYS04";
      } else if (this.keyword[2] == "RPA") {
        this.keyword[2] = "SYS05";
      } else if (this.keyword[2] == "전력계량기") {
        this.keyword[2] = "SYS06";
      } else if (this.keyword[2] == "전체") {
        this.keyword[2] = "";
      }
      if (this.keyword[1] == "개인정보") {
        this.keyword[1] = "CODE1PRI";
      } else if (this.keyword[1] == "지문정보") {
        this.keyword[1] = "CODE1FIN";
      } else if (this.keyword[1] == "일반문서") {
        this.keyword[1] = "CODE1WRP";
      } else if (this.keyword[1] == "신분증") {
        this.keyword[1] = "CODE1IDS";
      } else if (this.keyword[1] == "여권") {
        this.keyword[1] = "CODE1PAS";
      } else if (this.keyword[1] == "신용카드") {
        this.keyword[1] = "CODE1CRD";
      } else if (this.keyword[1] == "자동차번호판") {
        this.keyword[1] = "CODE1CAR";
      } else if (this.keyword[1] == "자동차주행거리") {
        this.keyword[1] = "CODE1ODO";
      } else if (this.keyword[1] == "가스미터계량기") {
        this.keyword[1] = "CODE1GAS";
      } else if (this.keyword[1] == "사업자등록증") {
        this.keyword[1] = "CODE1BUL";
      } else if (this.keyword[1] == "영수증") {
        this.keyword[1] = "CODE1REC";
      } else if (this.keyword[1] == "우편물반송") {
        this.keyword[1] = "CODE1POR";
      } else if (this.keyword[1] == "전력계량기") {
        this.keyword[1] = "CODE1PWM";
      } else if (this.keyword[1] == "전체") {
        this.keyword[1] = "";
      }
    },
    refactor() {
      for (var i = 0; i < this.result.length; i++) {
        if (this.result[i]["ifsystem_id"] == "SYS01") {
          this.result[i]["ifsystem_id"] = "OCR웹";
        } else if (this.result[i]["ifsystem_id"] == "SYS02") {
          this.result[i]["ifsystem_id"] = "사이버지점 안드로이드";
        } else if (this.result[i]["ifsystem_id"] == "SYS03") {
          this.result[i]["ifsystem_id"] = "사이버지점 iOS";
        } else if (this.result[i]["ifsystem_id"] == "SYS04") {
          this.result[i]["ifsystem_id"] = "사이버지점 서버";
        } else if (this.result[i]["ifsystem_id"] == "SYS05") {
          this.result[i]["ifsystem_id"] = "RPA";
        } else if (this.result[i]["ifsystem_id"] == "SYS06") {
          this.result[i]["ifsystem_id"] = "전력계량기";
        }
        if (this.result[i]["ocrmedia_id"] == "CODE1PRI") {
          this.result[i]["ocrmedia_id"] = "개인정보";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1FIN") {
          this.result[i]["ocrmedia_id"] = "지문정보";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1WRP") {
          this.result[i]["ocrmedia_id"] = "일반문서";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1IDS") {
          this.result[i]["ocrmedia_id"] = "신분증";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1PAS") {
          this.result[i]["ocrmedia_id"] = "여권";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1CRD") {
          this.result[i]["ocrmedia_id"] = "신용카드";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1CAR") {
          this.result[i]["ocrmedia_id"] = "자동차번호판";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1ODO") {
          this.result[i]["ocrmedia_id"] = "자동차주행거리";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1GAS") {
          this.result[i]["ocrmedia_id"] = "가스미터계량기";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1BUL") {
          this.result[i]["ocrmedia_id"] = "사업자등록증";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1REC") {
          this.result[i]["ocrmedia_id"] = "영수증";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1POR") {
          this.result[i]["ocrmedia_id"] = "우편물반송";
        } else if (this.result[i]["ocrmedia_id"] == "CODE1PWM") {
          this.result[i]["ocrmedia_id"] = "전력계량기";
        }
      }
    },
  },
  components: { LookupLogModal1, LookupLogModal2 }, //모달창 틀 가져오기
};
</script>
