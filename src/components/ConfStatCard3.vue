<template>
  <v-card>
    <v-card-title>
      <h6>숫자</h6>
    </v-card-title>

    <v-divider></v-divider>

    <v-simple-table fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">문자</th>
            <th class="text-left">신뢰도(%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in result" :key="item.ocrmedia_id">
            <td>{{ item.char_index }}</td>
            <td>{{ (item.confidence * 100).toFixed(2) }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>
<script>
import axios from 'axios'

const baseurl = '/Code1OcrWeb/confidence';

export default {
  components: {},
  props: ['document'],
  watch: {
    document() {
      this.result.splice(0);
      this.getData();
    },
  },
  data() {
    return {
      result: [],
    };
  },
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    getData() {
      axios
        .get(baseurl, {
          params: {
            ocrmedia_id: this.document,
          },
        })
        .then((res) => {
          console.log(res.data.num);
          for (var i = 0; i < res.data.num.length; i++) {
            this.result.push(res.data.num[i]);
          }
        });
    },
  },
};
</script>
