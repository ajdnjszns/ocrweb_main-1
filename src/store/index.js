import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "@/router/router";
import vueCookies from "vue-cookies";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  // plugins: [createPersistedState()],
  state: {
    adminLogin: false, // 관리자 로그인 상태
    autority: false, // 라우터 접근 권한 유무
    userLogin: false, // 유저 로그인 상태
    user_name: null, // 유저 로그인 시 이름
    organization: null, // 유저 로그인 시 부서이름
    // islogin: false, // 유저 로그아웃 세션 유지 플래그
    ocr_user_id: null,
  },
  getters: {},
  mutations: {
    //관리자 로그인 성공 시
    loginSuccess(state) {
      state.adminLogin = true;
      state.userLogin = false;
      state.autority = true;
      state.ocr_user_id = "!@admin#$";
      alert("로그인 됐습니다");
    },
    //관리자 로그인 에러 시
    loginError(state) {
      state.adminLogin = false;
      console.clear();
      alert("아이디 또는 비밀번호를 확인해 주세요");
      
    },
    //관리자 로그아웃 시
    logOut(state) {
      state.adminLogin = false;
      state.autority = false;
      alert("로그아웃 됐습니다");
    },
    //sso 로그인 성공 시
    userLogin(state) {
      state.userLogin = true;
      state.autority = true;
    },
    //sso 로그인 에러 시
    userLoginerror(state) {
      state.userLogin = false;
      state.autority = false;
    },
    //sso 로그아웃 시
    userLogout(state) {
      state.userLogin = false;
      state.autority = false;
      state.user_name = null;
      state.organization = null;
      state.ocr_user_id = null;
      // state.islogin = true;
      alert("로그아웃 됐습니다");
    },
  },
  actions: {
    //관리자 로그인
    login({ state, commit }, loginObj) {
      var result = "";
      var account = {};
      account.user_id = loginObj.id;
      account.password = loginObj.password;
      // Code1OcrWeb/login
      axios
        .post("/Code1OcrWeb/login", null, {
          params: {
            user_id: account.user_id,
            password: account.password,
          },
        })
        .then((res) => {
          console.log(res.statusText);
          result = res.status;
          if (result == 200) {
            commit("loginSuccess");
            router.push("/");
            const ssocookie = vueCookies.get("pgsecuid");
            axios
              .get("/Code1OcrWeb/ssologout", {
                params: {
                  pgsecuid: ssocookie,
                },
              })
              .then((res) => {
                console.log(res.data);
                vueCookies.set("pgesecuid", ssocookie);
              })
              .catch((error) => {
                console.log(error.response.status, "error");
              });
          }
        })
        .catch((error) => {
          commit("loginError");
          console.log(error.response.data)
        });
    },
    //관리자 로그아웃 & sso 로그인 시도
    logOut({ state, commit }) {
      axios.get("/Code1OcrWeb/logout").then((res) => {
        console.log(res);
        commit("logOut");
        router.push("/");
        const ssocookie = vueCookies.get("pgsecuid");
        //sso로그인
        axios
          .get("/Code1OcrWeb/ssotest", {
            params: {
              pgsecuid: ssocookie,
              user_id: "nynjn",
            },
          })
          .then((res) => {
            console.log(res);
            console.log(state.userLogout);
            vueCookies.set("pgesecuid", ssocookie);
            state.user_name = res.data.user_name;
            state.organization = res.data.organization;
            state.ocr_user_id = res.data.user_id;
            commit("userLogin");
          })
          .catch((error) => {
            console.log(error.response.data);
            router.push("/401");
            commit("userLoginerror");
          });
      });
    },
    //sso 로그인
    signInSso({ state, commit }) {
      console.log(state.userLogin);
      const ssocookie = vueCookies.get("pgsecuid");
      axios
        .get("/Code1OcrWeb/ssotest", {
          params: {
            pgsecuid: ssocookie,
            user_id: "nynjn",
          },
        })
        .then((res) => {
          console.log(res);
          console.log(state.userLogout);
          console.log(window.location.href)
          vueCookies.set("pgesecuid", ssocookie);
          state.user_name = res.data.user_name;
          state.organization = res.data.organization;
          state.ocr_user_id = res.data.user_id;

          commit("userLogin");
        })
        .catch((error) => {
          console.clear;
          router.push("/401");
          commit("userLoginerror");
        });
    },
    //sso로그아웃
    ssoLogOut({ state, commit }) {
      const ssocookie = vueCookies.get("pgsecuid");
      axios
        .get("/Code1OcrWeb/ssologout", {
          params: {
            pgsecuid: ssocookie,
          },
        })
        .then((res) => {
          console.log(res.data);
          vueCookies.set("pgesecuid", ssocookie);
          commit("userLogout");
          router.push("/");
        })
        .catch((error) => {
          console.log(error, "error");
        });
    },
  },
  modules: {},
});
