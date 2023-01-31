<template>
  <v-card>
    <v-row justify="space-between">
      <v-col class="mx-auto">
        <!-- 인사DB동기화 버튼 -->
        <v-btn
          color="primary"
          @click="loader = 'loading'"
          :loading="loading"
          :disabled="loading"
        >
          <v-icon left>mdi-autorenew</v-icon>
          <span>인사DB동기화</span>
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon dark > mdi-autorenew </v-icon>
            </span>
            <span>동기화 중...</span>
          </template>
        </v-btn>
      </v-col>
    </v-row>
    <v-card-title>
      <h6>총 {{ total_user }}명</h6>
      <v-spacer></v-spacer>
      <h6>최종 업데이트일: {{ reg_date }}</h6>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="result"
      :page.sync="page"
      :items-per-page="10"
      hide-default-footer
      dense
      class="elevation-1"
      @page-count="pageCount = $event"
    ></v-data-table>
    <v-row justify="center">
      <v-spacer></v-spacer>

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
      <v-col cols="4">
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </v-col>
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
import axios from 'axios';

const baseurl = '/Code1OcrWeb/user/list';

export default {
  components: {},
  data() {
    return {
      loader: null,
      loading: false,
      pagingcount: 1,
      week: ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)'],
      time: '',
      date: '',
      page: 1,
      pageCount: 0,
      search: '',

      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'user_id',
        },
        { text: '성명', value: 'user_name' },
        { text: '직급', value: 'position' },
        { text: '부서', value: 'organization' },
      ],
      result: [],
      total_user: 0,
      reg_date: [],
      sign: 0,
    };
  },
  setup() {},
  created() {},
  mounted() {
    this.getAll();
  },
  props: ['keyword'],
  unmounted() {},
  watch: {
    keyword() {
      this.result.splice(0);
      this.pageReset();
      this.getData();
    },
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      //인사 DB 동기화 기능 향후 추가
      this.loader = null;
    },
  },
  methods: {
    pageReset() {
      this.pagingcount = 1;
    },
    updateTime() {
      var cd = new Date();
      // 날짜 출력
      this.date =
        this.zeroPadding(cd.getFullYear(), 4) +
        '-' +
        this.zeroPadding(cd.getMonth() + 1, 2) +
        '-' +
        this.zeroPadding(cd.getDate(), 2) +
        ' ' +
        this.week[cd.getDay()];
      // 시간 출력
      this.time =
        this.zeroPadding(cd.getHours(), 2) +
        ':' +
        this.zeroPadding(cd.getMinutes(), 2) +
        ':' +
        this.zeroPadding(cd.getSeconds(), 2);
    },
    zeroPadding(num, digit) {
      var zero = '';
      for (var i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    },
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
    getData() {
      this.sign = 1;
      axios
        .get(baseurl, {
          params: {
            page: this.pagingcount,
            user_name: this.keyword[0],
            organization: this.keyword[1],
            user_id: this.keyword[2],
          },
        })
        .then((res) => {
          console.log(res.data);
          for (var i = 0; i < res.data.length; i++) {
            this.result.push(res.data[i]);
          }
          this.total_user = res.data[0].total_user;
          this.reg_date = res.data[0].reg_date;
        });
    },
    getAll() {
      this.sign = 0;
      axios.get(baseurl, { params: { page: this.pagingcount } }).then((res) => {
        console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
          this.result.push(res.data[i]);
        }
        this.total_user = res.data[0].total_user;
        this.reg_date = res.data[0].reg_date;
      });
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
    countDown() {
      this.pagingcount--;
    },
  },
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
