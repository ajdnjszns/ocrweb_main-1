<template>
  <v-card class="pa-4">
    <v-card-title>
      <h4>SMS</h4>
    </v-card-title>
    <v-divider class="mb-12"></v-divider>
    <v-row>
      <v-subheader><h3>수신번호</h3></v-subheader>

      <v-col cols="12" lg="4" class="pt-2">
        <v-text-field
          v-model="receiveNum"
          outlined
          dense
          @change="inputNum"
          hint="'ㅡ' 제외한 휴대폰 번호를 입력하세요"
        ></v-text-field>
      </v-col>
      <v-col cols="12" lg="2"></v-col>
    </v-row>
    <v-row class="ml-5">
      <v-subheader><h3>사번</h3></v-subheader>

      <v-col cols="12" lg="5" class="pt-2">
        <v-text-field
          outlined
          dense
          v-model="userNum"
          @change="inputUserNum"
        ></v-text-field>
      </v-col>
      <v-col cols="12" lg="2"></v-col>
    </v-row>
    <v-row class="ml-5">
      <v-subheader><h3>본문</h3></v-subheader>

      <v-col cols="12" lg="10">
        <v-textarea
          outlined
          auto-grow
          v-model="text"
          @change="inputText"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-divider class="mb-3"></v-divider>
    <v-card-actions>
      <v-btn color="primary" @click="submit" depressed> SMS전송 </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';

const baseurl = '/Code1OcrWeb/sms';

export default {
  components: {},
  data: () => ({
    receiveNum: '',
    userNum: '',
    text: '',
  }),
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    inputNum(e) {
      return (this.receiveNum = e.target.value);
    },
    inputUserNum(e) {
      return (this.userNum = e.target.value);
    },
    inputText(e) {
      return (this.text = e.target.value);
    },
    submit() {
      let result = {};
      result.receiveNum = this.receiveNum;
      result.userNum = this.userNum;
      result.text = this.text;

      try {
        axios
          .post(baseurl, null, {
            params: {
              receiveNum: result.receiveNum,
              userNum: result.userNum,
              text: result.text,
            },
          })
          .then((res) => {
            console.log(res);
            alert('전송 완료');
            this.receiveNum='';
            this.userNum='';
            this.text='';
          });
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
