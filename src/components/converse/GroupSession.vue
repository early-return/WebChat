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
import cfg from '@/config';

import {
  SEND_GROUP_MESSAGE,
  SHOW_NOTICE,
  FETCH_GROUPS,
} from '@/types/action-types';


export default {
  name: 'group-session',
  props: ['id'],
  data() {
    return {
      title: '在群组中的聊天',
      aside: {},
      menu: [
        {
          title: '退出群组',
          callback: () => {
            this.$http.post(`${cfg.serverAddress}/api/group/quit`, {
              token: this.$store.state.token,
              uid: this.$store.state.self._id,
              gid: this.id,
            }).then(() => {
              this.$router.go(-1);
              this.$store.dispatch(FETCH_GROUPS);
              this.$store.dispatch(SHOW_NOTICE, { message: '已退出该群组！', type: 'success', timeout: 3000 });
            });
          },
        },
      ],
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

