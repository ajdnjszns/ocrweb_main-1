<template>
  <v-container class="pa-16 mb-16">
    <!-- 제목 -->
    <v-row>
      <v-col sm="4" class="mb-4">
        <h2>로그 조회</h2>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-10">
      <v-col class="mb-5">
        <!-- 파일 입력창 -->
        <v-text-field
          label="파일명"
          dense
          type="text"
          clearable
          v-model="keywordFile"
          @change="inputFile"
          outlined
        ></v-text-field>
      </v-col>
      <v-col class="mb-5">
        <!-- 문서형식 입력창 -->
        <v-select
          :items="items1"
          label="문서형식"
          dense
          v-model="keywordDoc"
          @change="inputDoc"
          outlined
        ></v-select>
      </v-col>
      <v-col class="mb-5">
        <!-- 시스템 선택창 -->
        <v-select
          :items="items2"
          label="시스템"
          dense
          v-model="keywordsys"
          @change="inputsys"
          outlined
        ></v-select>
      </v-col>
      <v-col>
        <!-- 검색기간 선택창 -->
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
              v-model="dateRangeText"
              label="작업일시"
              prepend-icon="mdi-calendar-month"
              readonly
              v-bind="attrs"
              v-on="on"
              @change="inputDate"
              class="mb-4"
              outlined
              dense
            ></v-text-field>
          </template>
          <v-date-picker v-model="dates" locale="ko" range> </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row class="mb-10">
      <v-col cols="12" sm="3">
        <!-- 성명 입력란 -->
        <v-text-field
          label="성명"
          dense
          clearable
          v-model="keywordName"
          @change="inputName"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <!-- 부서 입력창 -->
        <v-text-field
          label="부서"
          dense
          clearable
          v-model="keywordDept"
          @change="inputDept"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <!-- ID 입력창 -->
        <v-text-field
          label="ID"
          dense
          clearable
          v-model="keywordId"
          @change="inputId"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <!-- 상태코드 입력창 -->
        <v-text-field
          label="상태코드"
          dense
          clearable
          v-model="keywordCode"
          @change="inputCode"
          outlined
        ></v-text-field>
      </v-col>
      <v-col align="center" class="mx-auto">
        <!-- 검색 버튼 -->
        <v-btn
          depressed
          color="primary"
          class="center"
          type="submit"
          @click="click"
          >검색</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mx-auto">
        <!-- 하위 컴포넌트 영역 -->
        <lookup-log-card-1 v-bind:keyword="text" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
  .v-select label {
    font-size: 0.9em;
  }

   .v-text-field label {
    font-size: 0.9em;
  }

</style>

<script>
import LookupLogCard1 from '@/components/LookupLogCard1.vue';
import dayjs from 'dayjs';

export default {
  methods: {
    inputFile(e) {
      return (this.keywordFile = e.target.value);
    },
    inputDoc(e) {
      return (this.keywordDoc = e.target.value);
    },
    inputsys(e) {
      return (this.keywordsys = e.target.value);
    },
    inputDate(e) {
      return (this.dates = e.target.value);
    },
    inputName(e) {
      return (this.keywordName = e.target.value);
    },
    inputDept(e) {
      return (this.keywordDept = e.target.value);
    },
    inputId(e) {
      return (this.keywordId = e.target.value);
    },
    inputCode(e) {
      return (this.keywordCode = e.target.value);
    },
    click() {
      return (this.text = [
        this.keywordFile,
        this.keywordDoc,
        this.keywordsys,
        this.dates,
        this.keywordName,
        this.keywordDept,
        this.keywordId,
        this.keywordCode,
      ]);
    },
  },
  components: {
    LookupLogCard1,
    dayjs,
  },
  computed: {
    dateRangeText() {
      return this.dates.sort().join(' ~ ');
    },
  },
  mounted() {},
  data: () => ({
    dates: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    items1: [
      '전체',
      '개인정보',
      '지문정보',
      '일반문서',
      '신분증',
      '여권',
      '신용카드',
      '자동차번호판',
      '자동차주행거리',
      '가스미터계량기',
      '사업자등록증',
      '영수증',
      '우편물발송',
      '전력계량기',
    ],
    items2: [
      '전체',
      'OCR웹',
      '사이버지점 안드로이드',
      '사이버지점 iOS',
      '사이버지점 서버',
      'RPA',
      '전력계량기',
    ],
    keywordFile: '',
    keywordDoc: '',
    keywordsys: '',
    keywordName: '',
    keywordDept: '',
    keywordId: '',
    keywordCode: '',
    text: '',
    menu1: false,
    menu2: false,
  }),
};
</script>
