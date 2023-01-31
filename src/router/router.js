import store from "@/store";
import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);

const routes = [

  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
    meta: {},
  },
  {
    path: "/doc",
    name: "doc",
    component: () =>
      import(/* webpackChunkName: "doc" */ "../views/DocProcess.vue"),
    meta: { autority: true },
  },
  {
    path: "/msg",
    name: "msg",
    component: () =>
      import(/* webpackChunkName: "msg" */ "../views/SendMessage.vue"),
    meta: { autority: true},
  },
  {
    path: "/usestat",
    name: "usestat",
    component: () =>
      import(/* webpackChunkName: "usestat" */ "../views/UseStat.vue"),
    meta: { autority: true},
  },
  {
    path: "/conf",
    name: "conf",
    component: () =>
      import(/* webpackChunkName: "conf" */ "../views/ConfStat.vue"),
    meta: {autority: true},
  },
  {
    path: "/users",
    name: "users",
    component: () =>
      import(/* webpackChunkName: "users" */ "../views/UsersView.vue"),
    meta: { adminLogin: true },
  },
  {
    path: "/log",
    name: "log",
    component: () =>
      import(/* webpackChunkName: "log" */ "../views/LookupLog.vue"),
    meta: { adminLogin: true },
  },
  {
    path: "/401",
    name: "401",
    component: () =>
      import(/* webpackChunkName: "401" */ "../views/PageNotFound.vue"),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

// 로그인 상태에 따른 라우터 접근 제한
router.beforeEach((to, from, next) => {
  if (to.meta.adminLogin && !store.state.adminLogin) {
    alert("관리자만 접근이 가능합니다."); 
    next(from); //이전 페이지로 보내기
  } else if (to.meta.autority && !store.state.autority) {
    alert("권한이 없습니다."); 
    next(from); //이전 페이지로 보내기
  } else {
    next(); //조건 충족 시 라우터 이동 
  }
});

export default router;
