<template>
  <v-container class="pa-16 mb-16">
    <v-row>
      <!-- 제목 -->
      <v-col sm="4" class="mb-4">
        <h2>사용 통계</h2>
      </v-col>
    </v-row>
    <v-row justify="space-between">
      <v-col>
        <!-- 통계 타입 선택창 -->
        <v-select
          :items="items1"
          label="통계"
          outlined
          dense
          v-model="selected1"
          @change="input1"
          type="text"
        ></v-select>
      </v-col>
      <v-col>
        <!-- 년도 선택 -->
        <v-select
          :items="items2"
          label="년도"
          outlined
          dense
          v-model="selected2"
          @change="input2"
          type="number"
          v-bind:disabled="selected1 == '년도별'"
        ></v-select>
      </v-col>
      <v-col>
        <!-- 월 선택 -->
        <v-select
          :items="items3"
          label="월"
          outlined
          dense
          v-model="selected3"
          @change="input3"
          type="number"
          v-bind:disabled="selected1 != '일별'"
        ></v-select>
      </v-col>
      <v-col>
        <!-- 문서형식 선택 -->
        <v-select
          :items="items4"
          label="문서형식"
          outlined
          dense
          v-model="selected4"
          @change="input4"
          type="text"
        ></v-select>
      </v-col>
      <v-col>
        <!-- 조회 버튼 -->
        <v-btn
          depressed
          color="primary"
          @click="click"
          >조회</v-btn
        >
      </v-col>
    </v-row>

    <v-row>
      <!-- 하위 컴포넌트 영역 -->
      <v-col cols="12" md="5">
        <use-stat-card-1 v-bind:keyword="keyword" />
      </v-col>
      <v-col cols="12" md="6" class="ml-1">
        <use-stat-card-2 v-bind:keyword="keyword" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UseStatCard1 from "@/components/UseStatCard1.vue";
import UseStatCard2 from "@/components/UseStatCard2.vue";

export default {
  components: {
    UseStatCard1,
    UseStatCard2,
  },
  data: () => ({
    items1: ["년도별", "월별", "일별"],
    items2: [],
    items3: [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ],
    items4: [
      "전체",
      "개인정보",
      "지문정보",
      "일반문서",
      "신분증",
      "여권",
      "신용카드",
      "자동차번호판",
      "자동차주행거리",
      "가스미터계량기",
      "사업자등록증",
      "영수증",
      "우편물발송",
      "전력계량기",
    ],
    selected1: "",
    selected2: "",
    selected3: "",
    selected4: "",
    keyword: [],
    // disable: false,
  }),

  methods: {
    // blur() {
    //   if (this.selected1 == "년도별") {
    //     if (this.selected4 != "") {
    //       this.disable = true;
    //     }
    //   } else if (this.selected1 == "월별") {
    //     if (this.selected2 != ""&&this.selected4 != "") {
    //       this.disable = true;
    //     }
    //   } else if (this.selected1 == "일별") {
    //     if (this.selected2 != "" && this.selected3 != ""&&this.selected4 != "") {
    //       this.disable = true;
    //     }
    //   }
    // },
    getYear() {
      var now = new Date();
      var year = now.getFullYear();
      for (var i = 2022; i < year + 1; i++) {
        this.items2.unshift(i);
      }
    },
    input1(e) {
      return (this.selected1 = e.target.value);
    },
    input2(e) {
      return (this.selected2 = e.target.value);
    },
    input3(e) {
      return (this.selected3 = e.target.value);
    },
    input4(e) {
      return (this.selected4 = e.target.value);
    },
    click() {
      this.keyword = [
        this.selected1,
        this.selected2,
        this.selected3,
        this.selected4,
      ];
      if (this.keyword[3] == "개인정보") {
        this.keyword[3] = "CODE1PRI";
      } else if (this.keyword[3] == "지문정보") {
        this.keyword[3] = "CODE1FIN";
      } else if (this.keyword[3] == "전체") {
        this.keyword[3] = "";
      } else if (this.keyword[3] == "일반문서") {
        this.keyword[3] = "CODE1WRP";
      } else if (this.keyword[3] == "신분증") {
        this.keyword[3] = "CODE1IDS";
      } else if (this.keyword[3] == "여권") {
        this.keyword[3] = "CODE1PAS";
      } else if (this.keyword[3] == "신용카드") {
        this.keyword[3] = "CODE1CRD";
      } else if (this.keyword[3] == "자동차번호판") {
        this.keyword[3] = "CODE1CAR";
      } else if (this.keyword[3] == "자동차주행거리") {
        this.keyword[3] = "CODE1ODO";
      } else if (this.keyword[3] == "가스미터계량기") {
        this.keyword[3] = "CODE1GAS";
      } else if (this.keyword[3] == "사업자등록증") {
        this.keyword[3] = "CODE1BUL";
      } else if (this.keyword[3] == "영수증") {
        this.keyword[3] = "CODE1REC";
      } else if (this.keyword[3] == "우편물반송") {
        this.keyword[3] = "CODE1POR";
      } else if (this.keyword[3] == "전력계량기") {
        this.keyword[3] = "CODE1PWM";
      }
      this.reset();
    },
    reset() {
      this.selected1 = "";
      this.selected2 = "";
      this.selected3 = "";
      this.selected4 = "";
    },
  },
  mounted() {
    this.getYear();
  },
  computed: {
    
  },
};
</script>
