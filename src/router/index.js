import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Converse from '@/components/converse/Converse';
import Chat from '@/components/Chat';
import Group from '@/components/Group';
import Status from '@/components/Status';
import Waiting from '@/components/Waiting';
import Login from '@/components/Login';


Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Checker',
      component: Waiting,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat,
      meta: { requiresAuth: true },
    },
    {
      path: '/group',
      name: 'Group',
      component: Group,
      meta: { requiresAuth: true },
    },
    {
      path: '/status',
      name: 'Status',
      component: Status,
      meta: { requiresAuth: true },
    },
    {
      path: '/talk/:uid',
      name: 'Conserse',
      component: Converse,
      props: true,
      meta: { requiresAuth: true },
    },
  ],
});

// 检查将要跳转的路由是否需要认证，如需要认证且当前没有认证即跳转到登陆界面
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.self) {
      next({
        path: '/login',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
