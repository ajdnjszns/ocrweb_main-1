<template>
  <v-container class="pa-16 mb-16">
    <v-row>
      <!-- 제목 -->
      <v-col sm="4" class="mb-4">
        <h2>사용자 관리</h2>
      </v-col>
    </v-row>
    <v-row justify="space-between" class="mt-10">
      <v-col class="mb-5" cols="3">
        <!-- 성명 입력창 -->
        <v-text-field
          label="성명"
          dense
          type="text"
          clearable
          v-model="keywordName"
          @change="inputName"
          outlined
        ></v-text-field>
      </v-col>
      <v-col class="mb-5" cols="3">
        <!-- 부서 입력창  -->
        <v-text-field
          label="부서"
          dense
          type="text"
          clearable
          v-model="keywordDept"
          @change="inputDept"
          outlined
        ></v-text-field>
      </v-col>
      <v-col class="mb-5" cols="3">
        <!-- ID 입력창 -->
        <v-text-field
          label="ID"
          dense
          type="text"
          clearable
          v-model="keywordId"
          @change="inputId"
          outlined
        ></v-text-field>
      </v-col>
      <v-col>
        <!-- 검색 버튼 -->
        <v-btn class="mb-3" color="primary" @click="click" ref="search">
          <span>검색</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mx-auto">
        <!-- 하위 컴포넌트 영역 -->
        <user-view-card-1  v-bind:keyword="text"/>
        <!-- <user-view-card-1-copy /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserViewCard1 from '@/components/UserViewCard1.vue';

export default {
  components: {
    UserViewCard1,
    
  },
  data:() => ({
    keywordName: '',
    keywordDept: '',
    keywordId: '',
    text: '',
  }),
  methods: {
    inputName(e) {
      return (this.keywordName = e.target.value);
    },
    inputDept(e) {
      return (this.keywordDept = e.target.value);
    },
    inputId(e) {
      return (this.keywordId = e.target.value);
    },
    click() {
      return (this.text = [this.keywordName, this.keywordDept, this.keywordId]);
    },
  },
};
</script>
