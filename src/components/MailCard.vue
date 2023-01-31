<template>
  <v-card class="pa-4">
    <v-card-title>
      <h4>메일</h4>
    </v-card-title>
    <v-divider class="mb-12"></v-divider>
    <v-row class="pl-2">
      <v-subheader><h3>주소</h3></v-subheader>

      <v-col cols="12" lg="6" class="pt-2">
        <v-text-field
          v-model="address"
          suffix="@kepco.co.kr"
          outlined
          dense
          @change="inputAddress"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="pl-2">
      <v-subheader><h3>제목</h3></v-subheader>

      <v-col cols="12" lg="10" class="pt-2">
        <v-text-field
          outlined
          dense
          v-model="title"
          @change="inputTitle"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="pl-2">
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
      <v-btn color="primary" @click="submit" depressed> 메일전송 </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import axios from 'axios'

const baseurl= '/Code1OcrWeb/sendmail'

export default {
  components: {},
  data: () => ({
    address: '',
    title: '',
    text: '',
  }),
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    inputAddress(e) {
      return (this.address = e.target.value);
    },
    inputTitle(e) {
      return (this.title = e.target.value);
    },
    inputText(e) {
      return (this.text = e.target.value);
    },
    submit() {
      let result = {};
      result.address = this.address +'@kepco.co.kr';
      result.title = this.title;
      result.text = this.text;

      try {
        axios
          .post(baseurl, null, {
            params: {
              address: result.address,
              title: result.title,
              text: result.text,
            },
          })
          .then((res) => {
            console.log(res);
            alert('전송 완료');
            this.address='';
            this.title='';
            this.text='';
          });
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
