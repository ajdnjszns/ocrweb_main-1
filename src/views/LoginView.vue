<template>
  <v-content>
    <v-card width="600" class="mx-auto mt-9">
      <v-card-title>관리자 로그인</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <!-- 아이디 입력창 -->
        <v-text-field
          v-model="id"
          filled
          color="indigo darken-3"
          label="아이디"
          prepend-icon="mdi-account-circle"
          dense
        ></v-text-field>
        <!-- 패스워드 입력창 -->
        <v-text-field
          v-model="password"
          filled
          color="indigo darken-3"
          label="비밀번호"
          style="min-height: 96px"
          type="password"
          prepend-icon="mdi-lock"
          dense
        ></v-text-field>

        <v-card-actions>
          <!-- 로그인 버튼 -->
          <v-spacer></v-spacer>
          <v-btn
            class="white--text"
            color="indigo darken-3"
            @click="login({ id, password })"
          >
            로그인
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-content>
</template>

<script>
import { mapState, mapActions } from "vuex";
import axios from "axios";

const baseurl = "/Code1OcrWeb/login";

export default {
  components: {},
  data() {
    return {
      id: "",
      password: "",
      data: "",
      success: "",
      logout: "",
      loginSuccess: false,
    };
  },
  computed: {
    ...mapState(["adminLogin"]),
  },
  methods: {
    ...mapActions(["login"]),
  },
};
</script>
