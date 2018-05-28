<template>
  <session :id="id" :title="title" :messages='messages' :aside="aside" :menu="menu" @send="sendMessage"></session>
</template>

<script>
import Session from '@/components/converse/Session';
import cfg from '@/config';

import {
  SEND_MESSAGE,
  FETCH_FRIENDS,
  SHOW_NOTICE,
} from '@/types/action-types';


export default {
  name: 'friend-session',
  props: ['id'],
  data() {
    return {
      title: '与好友的聊天',
      aside: {},
    };
  },
  created() {
    this.initAside();
  },
  computed: {
    messages() {
      return this.$store.getters.getMessagesByUID(this.id);
    },
    menu() {
      if (this.$store.getters.getFriendByID(this.id)) {
        return [{
          title: '删除好友',
          callback: () => {
            this.$http.post(`${cfg.serverAddress}/api/friend/remove`, {
              token: this.$store.state.token,
              fromId: this.$store.state.self._id,
              toId: this.id,
            }).then(() => {
              this.$store.dispatch(FETCH_FRIENDS);
              this.$router.go(-1);
              this.$store.dispatch(SHOW_NOTICE, { message: '删除成功!', type: 'success', timeout: 3000 });
            });
          },
        }];
      }
      return [{
        title: '加为好友',
        callback: () => {
          this.$http.post(`${cfg.serverAddress}/api/friends/addwithid`, {
            token: this.$store.state.token,
            fromId: this.$store.state.self._id,
            toId: this.id,
          }).then(() => {
            this.$store.dispatch(FETCH_FRIENDS);
            this.$store.dispatch(SHOW_NOTICE, { message: '已成功添加为好友！', type: 'success', timeout: 3000 });
          });
        },
      }];
    },
  },
  methods: {
    sendMessage(payload) {
      this.$store.dispatch(SEND_MESSAGE, payload);
    },
    initAside() {
      const friend = this.$store.getters.getFriendByID(this.id);
      if (!friend) {
        // TODO: Not a friend
        return;
      }
      this.setAside(friend);
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

