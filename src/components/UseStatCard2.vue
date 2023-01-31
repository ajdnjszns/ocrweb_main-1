<template>
  <v-card>
    <v-card-title>
      <h6>{{ doc }} 처리건수</h6></v-card-title
    >
    <div id="chartArea">
      <canvas id="myChart"></canvas>
    </div>
  </v-card>
</template>
<script>
import axios from 'axios';
import Chart from 'chart.js';

const baseurl = '/Code1OcrWeb/stats';

export default {
  data: () => ({
    myChart: null,
    result: [],
    inputdata1: null,
    keyword1: null,
    doc: null,
    daylist: [],
  }),
  props: ['keyword'],
  watch: {
    keyword() {
      this.myChart.destroy();
      this.getData();
      this.getKeyword();
    },
  },
  mounted() {
    this.getDefault();
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
      var chartlabels = [];
      var chartdata = [];

      if (this.keyword[0] == '년도별') {
        axios
          .get(baseurl + '?stats_flag=Y', {
            params: {
              ocrmedia_id: this.keyword[3],
            },
          })
          .then((res) => {
            console.log(res.data);
            for (var i = 0; i < res.data.length; i++) {
              chartlabels.push(res.data[i].year + '년');
              chartdata.push(res.data[i].yearly_count);
            }

            var ctx = document.getElementById('myChart');

            var config = {
              type: 'bar',
              data: {
                labels: chartlabels,
                datasets: [
                  {
                    data: chartdata,
                    borderWidth: 1,
                    label: '처리건수',
                    backgroundColor: 'rgba(0, 0, 255, 0.8)',
                  },
                ],
              },
              options: {
                responsive: true,
              },
            };
            // var myChart = new Chart(ctx, config);
            this.myChart = new Chart(ctx, config);
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
            for (var i = 0; i < res.data.length; i++) {
              chartlabels.push(res.data[i].month + '월');
              chartdata.push(res.data[i].monthly_count);
            }

            var ctx = document.getElementById('myChart');

            var config = {
              type: 'bar',
              data: {
                labels: chartlabels,
                datasets: [
                  {
                    data: chartdata,
                    borderWidth: 1,
                    label: '처리건수',
                    backgroundColor: 'rgba(0, 0, 255, 0.8)',
                  },
                ],
              },
              options: {
                responsive: true,
              },
            };
            // var myChart = new Chart(ctx, config);
            this.myChart = new Chart(ctx, config);
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
            daylist.push(
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
              { day: '31', count: res.data[0].day_31_count }
            );
            for (var i = 0; i < daylist.length; i++) {
              if (daylist[i].count == null) {
                daylist[i].count = 0;
              }
              chartlabels.push(daylist[i].day);
              chartdata.push(daylist[i].count);
            }

            var ctx = document.getElementById('myChart');

            var config = {
              type: 'bar',
              data: {
                labels: chartlabels,
                datasets: [
                  {
                    data: chartdata,
                    borderWidth: 1,
                    label: '처리건수',
                    backgroundColor: 'rgba(0, 0, 255, 0.8)',
                  },
                ],
              },
              options: {
                responsive: true,
              },
            };
            // var myChart = new Chart(ctx, config);
            this.myChart = new Chart(ctx, config);
          });
      }
    },
    getDefault() {
      
      var chartlabels = [];
      var chartdata = [];

      this.doc = '전체';

      axios
        .get(baseurl + '?stats_flag=Y', {
          params: {
            ocrmedia_id: this.keyword[3],
          },
        })
        .then((res) => {
          console.log(res.data);
          for (var i = 0; i < res.data.length; i++) {
            chartlabels.push(res.data[i].year + '년');
            chartdata.push(res.data[i].yearly_count);
          }

          var ctx = document.getElementById('myChart');

          var config = {
            type: 'bar',
            data: {
              labels: chartlabels,
              datasets: [
                {
                  data: chartdata,
                  borderWidth: 1,
                  label: '처리건수',
                  backgroundColor: 'rgba(0, 0, 255, 0.8)',
                },
              ],
            },
            options: {
              responsive: true,
            },
          };
          // var myChart = new Chart(ctx, config);
          this.myChart = new Chart(ctx, config);
        });
    },
  },
};
</script>
