import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Converse from '@/components/converse/Converse';
import Home from '@/components/Home';
import Chat from '@/components/home/Chat';
import Group from '@/components/home/Group';
import Status from '@/components/home/Status';
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
      path: '',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/chat',
          name: 'Chat',
          component: Chat,
        },
        {
          path: '/group',
          name: 'Group',
          component: Group,
        },
        {
          path: '/status',
          name: 'Status',
          component: Status,
        },
      ],
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
