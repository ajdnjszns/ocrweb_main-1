<template>
  <v-card>
    <v-card-title>
      <h6 v-if="keyword[0] == '월별'">{{ keyword[1] }}년</h6>
      <h6 v-else-if="keyword[0] == '일별'">
        {{ keyword[1] }}년 {{ keyword[2] }}월
      </h6>
      <h6 v-else-if="keyword[0] == '년도별'"></h6>
      <v-spacer></v-spacer>
      <h6>문서형식: {{ doc }}</h6>
    </v-card-title>
    <v-simple-table dense height="500" fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              <h3 v-if="result[0].stats_flag == 'Y'">년도별</h3>
              <h3 v-else-if="keyword[0] == '년도별'">년도별</h3>
              <h3 v-else-if="keyword[0] == '월별'">월별</h3>
              <h3 v-else-if="keyword[0] == '일별'">일별</h3>
            </th>
            <th class="text-left"><h3>처리건수</h3></th>
          </tr>
        </thead>
        <tbody v-if="result[0].stats_flag == 'Y'">
          <tr v-for="item in result" :key="item.stats_flag">
            <td>{{ item.year }}</td>
            <td>{{ item.yearly_count }}</td>
          </tr>
        </tbody>
        <tbody v-if="keyword[0] == '월별'">
          <tr v-for="item in result" :key="item.stats_flag">
            <td>{{ item.month }}</td>
            <td>{{ item.monthly_count }}</td>
          </tr>
        </tbody>
        <tbody v-if="keyword[0] == '일별'">
          <tr v-for="item in result" :key="item.day">
            <td>{{ item.day }}</td>
            <td>{{ item.count }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import axios from 'axios';

const baseurl = '/Code1OcrWeb/stats';

export default {
  data: () => ({
    result: [],
    doc: null,
  }),
  props: ['keyword'],
  watch: {
    keyword() {
      this.getKeyword();
      this.getData();
    },
  },
  mounted() {
    this.getAll();
  },
  methods: {
    getKeyword() {
      this.doc = this.keyword[3];
      if (this.doc == 'CODE1PRI') {
        this.doc = '개인정보';
      } else if (this.doc == 'CODE1IDS') {
        this.doc = '신분증';
      } else if (this.doc == 'CODE1FIN') {
        this.doc = '지문정보';
      } else if (this.doc == 'CODE1WRP') {
        this.doc = '일반문서';
      } else if (this.doc == '') {
        this.doc = '전체';
      } else if (this.doc == 'CODE1PAS') {
        this.doc = '여권';
      } else if (this.doc == 'CODE1CAR') {
        this.doc = '자동차번호판';
      } else if (this.doc == 'CODE1ODO') {
        this.doc = '자동차주행거리';
      } else if (this.doc == 'CODE1PRI') {
        this.doc = '가스미터계량기';
      } else if (this.doc == 'CODE1BUL') {
        this.doc = '사업자등록증';
      } else if (this.doc == 'CODE1REC') {
        this.doc = '영수증';
      } else if (this.doc == 'CODE1POR') {
        this.doc = '우편물반송';
      } else if (this.doc == 'CODE1PWM') {
        this.doc = '전력계량기';
      } else if (this.doc == 'CODE1CRD') {
        this.doc = '신용카드';
      }
    },

    getData() {
      this.result.splice(0);
      

      if (this.keyword[0] == '년도별') {
        axios
          .get(baseurl + '?stats_flag=Y', {
            params: {
              ocrmedia_id: this.keyword[3],
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.length == 0) {
              alert('데이터가 없습니다');
              this.result.push({ year: '', yearly_count: '' });
            } else {
              for (var i = 0; i < res.data.length; i++) {
                this.result.push(res.data[i]);
              }
            }
          });
      } else if (this.keyword[0] == '월별') {
        axios
          .get(baseurl + '?stats_flag=M', {
            params: {
              year: this.keyword[1],
              ocrmedia_id: this.keyword[3],
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.length == 0) {
              alert('데이터가 없습니다');
              this.result.push({ month: '', monthly_count: '' });
            } else {
              for (var i = 0; i < res.data.length; i++) {
                this.result.push(res.data[i]);
              }
            }
          });
      } else if (this.keyword[0] == '일별') {
        var daylist = [];

        axios
          .get(baseurl + '?stats_flag=D', {
            params: {
              year: this.keyword[1],
              month: this.keyword[2],
              ocrmedia_id: this.keyword[3],
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.length == 0) {
              alert('데이터가 없습니다');
              daylist = [{ day: '', count: '' }];
              this.result = daylist;
            } else {
              daylist = [
                { day: '01', count: res.data[0].day_01_count },
                { day: '02', count: res.data[0].day_02_count },
                { day: '03', count: res.data[0].day_03_count },
                { day: '04', count: res.data[0].day_04_count },
                { day: '05', count: res.data[0].day_05_count },
                { day: '06', count: res.data[0].day_06_count },
                { day: '07', count: res.data[0].day_07_count },
                { day: '08', count: res.data[0].day_08_count },
                { day: '09', count: res.data[0].day_09_count },
                { day: '10', count: res.data[0].day_10_count },
                { day: '11', count: res.data[0].day_11_count },
                { day: '12', count: res.data[0].day_12_count },
                { day: '13', count: res.data[0].day_13_count },
                { day: '14', count: res.data[0].day_14_count },
                { day: '15', count: res.data[0].day_15_count },
                { day: '16', count: res.data[0].day_16_count },
                { day: '17', count: res.data[0].day_17_count },
                { day: '18', count: res.data[0].day_18_count },
                { day: '19', count: res.data[0].day_19_count },
                { day: '20', count: res.data[0].day_20_count },
                { day: '21', count: res.data[0].day_21_count },
                { day: '22', count: res.data[0].day_22_count },
                { day: '23', count: res.data[0].day_23_count },
                { day: '24', count: res.data[0].day_24_count },
                { day: '25', count: res.data[0].day_25_count },
                { day: '26', count: res.data[0].day_26_count },
                { day: '27', count: res.data[0].day_27_count },
                { day: '28', count: res.data[0].day_28_count },
                { day: '29', count: res.data[0].day_29_count },
                { day: '30', count: res.data[0].day_30_count },
                { day: '31', count: res.data[0].day_31_count },
              ];
              for (var i = 0; i < daylist.length; i++) {
                if (daylist[i].count == null) {
                  daylist[i].count = 0;
                }
              }
              this.result = daylist;
            }
          });
      }
    },
    getAll() {
      axios
        .get(baseurl + '?stats_flag=Y', {
          params: {
            ocrmedia_id: '',
          },
        })
        .then((res) => {
          console.log(res.data);
          this.result = res.data;
        });
      this.doc = '전체';
    },
  },
  computed: {},
  components: {},
};
</script>
