<template>
  <v-card>
    <v-card-title>
      <h6>문서형식:{{ doctype }}</h6>
    </v-card-title>

    <v-divider></v-divider>

    <v-simple-table fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">항목</th>
            <th class="text-left">신뢰도(%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in result" :key="item.ocrmedia_id">
            <td>{{ item.key_item_name }}</td>
            <td>{{ (item.confidence * 100).toFixed(2) }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>
<script>
import axios from 'axios';

const baseurl = '/Code1OcrWeb/confidence';

export default {
  name: 'ConfStatCard1',
  props: ['document'],
  watch: {
    document() {
      this.result.splice(0);
      this.getData();
      this.getDocument();
    },
  },
  components: {},
  data: () => ({
    result: [],
    doctype:''
  }),

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
          console.log(res.data.key);

          for (var i = 0; i < res.data.key.length; i++) {
            this.result.push(res.data.key[i]);
          }
        });
    },
    getDocument() {
      if (this.document == 'CODE1IDS') {
        this.doctype = '신분증';
      } else if (this.document == 'CODE1CRD') {
        this.doctype = '신용카드';
      } else if (this.document == 'CODE1BUL') {
        this.doctype = '사업자등록증';
      } else if (this.document == 'CODE1REC') {
        this.doctype = '영수증';
      }
    },
  },
};
</script>
