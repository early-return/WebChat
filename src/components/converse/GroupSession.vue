<template>
  <session
    :id="id"
    :title="title"
    :messages='messages'
    :aside="aside"
    @send="sendMessage"
  ></session>
</template>

<script>
import Session from '@/components/converse/Session';

import {
  SEND_GROUP_MESSAGE,
} from '@/types/action-types';


export default {
  name: 'group-session',
  props: ['id'],
  data() {
    return {
      title: '在群组中的聊天',
      aside: {},
    };
  },
  computed: {
    messages() {
      return this.$store.getters.getGroupMessagesByUID(this.id);
    },
  },
  created() {
    this.initAside();
  },
  methods: {
    sendMessage(payload) {
      this.$store.dispatch(SEND_GROUP_MESSAGE, payload);
    },
    initAside() {
      const group = this.$store.getters.getGroupByID(this.id);
      this.title = `在 ${group.name} 中的聊天`;
      const aside = {};
      aside.name = group.name;
      aside.avatar = group.avatar;
      aside.bgImage = group.bgImage;
      const infos = [
        { title: '用户', content: 20, link: '#' },
        { title: '在线', content: 10, link: '#' },
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

