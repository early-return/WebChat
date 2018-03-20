import Vue from 'vue';
import Router from 'vue-router';
import Converse from '@/components/converse/Converse';
import Chat from '@/components/Chat';
import Group from '@/components/Group';
import Status from '@/components/Status';
import Checker from '@/components/Checker';
import Login from '@/components/Login';


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Checker',
      component: Checker,
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
    {
      path: '/talk/:uid',
      name: 'Conserse',
      component: Converse,
      props: true,
    },
  ],
});
