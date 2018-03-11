import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import Chat from '@/components/Chat';
import Group from '@/components/Group';
import Status from '@/components/Status';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
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
  ],
});
