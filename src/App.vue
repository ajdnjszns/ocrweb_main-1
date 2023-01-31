<template>
  <v-app id="inspire">
    <v-app-bar app color="indigo darken-3" v-if="autority">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        color="white"
      ></v-app-bar-nav-icon>

      <v-toolbar-title class="white--text"
        ><h3>한국전력공사 OCR</h3></v-toolbar-title
      >

      <v-spacer></v-spacer>
      <div v-if="userLogin">
        <v-icon class="mb-1 white--text"> mdi-account </v-icon>
        <span class="white--text"> {{ user_name }}님 / {{ organization }}</span>
      </div>

      <v-btn @click="logOut" v-if="adminLogin" text class="white--text"
        ><v-icon left> mdi-logout </v-icon>
        <h4>Logout</h4></v-btn
      >
      <v-btn
        @click="ssoLogOut"
        v-if="userLogin"
        text
        class="mb-1 ml-2 white--text"
        ><v-icon left> mdi-logout </v-icon>
        <h4>Logout</h4></v-btn
      >
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> 메뉴 </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-group
        v-for="item in items"
        :key="item.title"
        :prepend-icon="item.icon"
        no-action
        :value="true"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="child in item.items"
          :key="child.title"
          :to="child.to"
        >
          <v-list-item-content>
            <v-list-item-title v-text="child.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-divider></v-divider>

      <div v-if="adminLogin">
        <v-list-group
          v-for="item in items2"
          :key="item.title"
          :prepend-icon="item.icon"
          no-action
          :value="true"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :key="child.title"
            :to="child.to"
          >
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </div>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    user: null,
    org: null,
    access: false,
    logout: null,
    drawer: null,
    items: [
      {
        title: "OCR",
        items: [
          { title: "처리현황", to: "/doc" },
          { title: "메시지 전송", to: "/msg" },
          { title: "사용통계", to: "/usestat" },
          { title: "신뢰도 통계", to: "/conf" },
        ],
        icon: "mdi-text-box-multiple",
      },
    ],
    items2: [
      {
        title: "관리자",
        items: [
          { title: "사용자 관리", to: "/users" },
          { title: "로그조회", to: "/log" },
        ],
        icon: "mdi-account-hard-hat",
      },
    ],
  }),
  computed: {
    // store/index.js state항목을 가져옴
    ...mapState(["adminLogin", "userLogin", "user_name", "organization","autority"]),
  },
  methods: {
    // store/index.js actions의 메소드 가져옴
    ...mapActions(["logOut"]),
    ...mapActions(["ssoLogOut"]),
    ...mapActions(["signInSso"]),

    // 새로고침 시 경고문
    unLoadEvent: function (event) {
      if (this.isLeaveSite) return;
      event.preventDefault();
      event.returnValue = "";
    },
  },
  mounted() {
    // 메인 페이지 로드 시 sso로그인 시도
    var str = window.location.href;
    var words = str.split("/");
    var arr = words[words.length - 1];
    if (arr != "login") {
      this.signInSso();
    }
    // 새로고침 시 경고문
    window.addEventListener("beforeunload", this.unLoadEvent);
  },

  // 새로고침 시 경고문
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.unLoadEvent);
  },
};
</script>
