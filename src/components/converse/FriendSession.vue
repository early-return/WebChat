<template>
  <session
    :id="id"
    :title="title"
    :messages='messages'
    :aside="aside"
    :menu="menu"
    @send="sendMessage"
  ></session>
</template>

<script>
import Session from '@/components/converse/Session';

import {
  SEND_MESSAGE,
} from '@/types/action-types';


export default {
  name: 'friend-session',
  props: ['id'],
  data() {
    return {
      title: '与好友的聊天',
      messages: [],
      aside: {},
      menu: [],
    };
  },
  created() {
    this.initAside();
    this.initMessages();
  },
  methods: {
    sendMessage(payload) {
      this.$store.dispatch(SEND_MESSAGE, payload);
    },
    initAside() {
      const friend = this.$store.getters.getFriendByID(this.id);
      if (!friend) {
        // TODO: Not a friend
        console.log('Not a friend');
        this.menu.push({ title: '加为好友', callback: () => {} });
        return;
      }
      this.menu.push({ title: '删除好友', callback: () => {} });
      this.setAside(friend);
    },
    initMessages() {
      this.messages = this.$store.getters.getMessagesByUID(this.id);
    },
    setAside(friend) {
      this.title = `与 ${friend.name} 的聊天`;
      const aside = {};
      aside.name = friend.name;
      aside.avatar = friend.avatar;
      aside.bgImage = friend.bgImage;
      const infos = [
        { title: '动态', content: 10, link: '#' },
      ];
      aside.infos = infos;
      this.aside = aside;
    },
  },
  components: {
    Session,
  },
};
</script>

