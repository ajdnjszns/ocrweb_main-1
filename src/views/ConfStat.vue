<template>
  <v-container class="pa-16 mb-16">
    <!-- 제목 -->
    <v-row>
      <v-col sm="4" class="mb-4">
        <h2>신뢰도 통계</h2>
      </v-col>
    </v-row>
    <!-- 입력창 -->
    <v-row>
      <v-col cols="12" md="3">
        <v-select
          :items="items1"
          label="문서형식"
          outlined
          dense
          v-model="selected"
          @change="input"
          
        ></v-select>
      </v-col>
      <!-- 조회 버튼 -->
      <v-col>
        <v-btn depressed color="primary" class="mb-4" @click="click" type="submit"
          >조회</v-btn
        >
      </v-col>
    </v-row>
    <!-- 하위 컴포넌트 영역 -->
    <v-row>
      <v-col cols="10" md="2"
        ><conf-stat-card-1 v-bind:document="text"
      /></v-col>
      <v-col cols="10" md="2"
        ><conf-stat-card-2 v-bind:document="text"
      /></v-col>
      <v-col cols="10" md="2"
        ><conf-stat-card-3 v-bind:document="text"
      /></v-col>
      <v-col cols="10" md="2"
        ><conf-stat-card-4 v-bind:document="text"
      /></v-col>
      <v-col cols="10" md="2"
        ><conf-stat-card-5 v-bind:document="text"
      /></v-col>
    </v-row>
  </v-container>
</template>

<style>
  .v-select label {
    font-size: 0.9em;
  }
</style>

<script>

import ConfStatCard1 from '@/components/ConfStatCard1.vue';
import ConfStatCard2 from '@/components/ConfStatCard2.vue';
import ConfStatCard3 from '@/components/ConfStatCard3.vue';
import ConfStatCard4 from '@/components/ConfStatCard4.vue';
import ConfStatCard5 from '@/components/ConfStatCard5.vue';

export default {
  components: {
    ConfStatCard1,
    ConfStatCard2,
    ConfStatCard3,
    ConfStatCard4,
    ConfStatCard5,
  },
  data() {
    return {
      items1: ['신분증', '신용카드', '사업자등록증', '영수증'],
      selected: '',
      text: '',
    };
  },
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    input(e) {
      this.selected = e.target.value
    },
    click() {
      if (this.selected == '신분증') {
        this.selected = 'CODE1IDS';
      } else if (this.selected == '신용카드') {
        this.selected = 'CODE1CRD';
      } else if (this.selected == '사업자등록증') {
        this.selected = 'CODE1BUL';
      } else if (this.selected == '영수증') {
        this.selected = 'CODE1REC';
      }
      this.text = this.selected;
    },
  },
};
</script>
