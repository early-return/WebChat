<template>
  <main class="messages-container">
    <div class="messages">
      <router-link class="message" :to="`/${isGroup ? 'group/' + msg.toId : 'talk/' + msg.session}`" href="#" v-for="msg in messages" :key="msg._id">
        <img class="avatar" :src="getAvatar(msg)">
        <div class="desc">
          <div class="nickname">{{ getFriendName(msg) }}<div class="unknown" v-if="!isKnown(msg.session)">陌生人</div></div>
          <div class="content">{{ `${getName(msg)}: ${msg.message}` }}</div>
        </div>
      </router-link>
    </div>
  </main>
</template>

<script>

export default {
  name: 'conversations',
  props: ['messages'],
  data() {
    return {
      isGroup: false,
    };
  },
  created() {
    this.isGroup = this.$route.name === 'Group';
  },
  computed: {
    self() {
      return this.$store.state.self;
    },
  },
  methods: {
    getName(msg) {
      if (msg.fromId === this.self._id) {
        return '我';
      }
      return this.getFriendName(msg);
    },
    getFriendName(msg) {
      if (this.isGroup) {
        return this.$store.getters.getGroupByID(msg.toId).name;
      }
      if (this.$store.getters.getFriendByID(msg.session)) {
        return this.$store.getters.getFriendByID(msg.session).name;
      }
      return this.$store.getters.getMessagesByUID(msg.session)
        .find(message => message.fromId !== this.self._id).fromName;
    },
    getAvatar(msg) {
      if (this.isGroup) {
        return '/static/img/avatar/unknown.png';
      }
      const friend = this.$store.getters.getFriendByID(msg.session);
      if (friend) {
        return friend.avatar;
      }
      return this.$store.getters.getMessagesByUID(msg.session)
        .find(message => message.fromId !== this.self._id).fromAvatar;
    },
    isKnown(uid) {
      if (this.isGroup) {
        return true;
      }
      if (this.$store.getters.getFriendByID(uid)) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped lang="scss">
main.messages-container {
  box-sizing: border-box;
  overflow: auto;
}

.messages {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
}
.message {
  box-sizing: border-box;
  width: 100%;
  text-decoration: none;
  background-color: $white;
  color: darken($gray, 20%);
  flex-shrink: 0;
  border-bottom: 2px solid $lightgray;
  padding: 10px 15px;
  display: flex;
}
.message:first {
  border-radius: 5px 5px 0 0;
}
.message:last {
  border-radius: 0 0 5px 5px;
}

.message .avatar {
  flex-grow: 0;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  align-self: center;
  margin: auto 0;
}
.message .desc {
  flex-grow: 1;
  display: flex;
  margin-left: 10px;
  flex-direction: column;
  align-items: flex-start;
}
.unknown {
  display: inline-block;
  padding: 2px 5px;
  font-size: 8px;
  border-radius: 3px;
  margin-left: 5px;
  color: #FFF;
  background-color: $blue;
}
.message .desc .content {
  font-size: 0.8em;
  color: lighten($gray, 10%);
}
</style>


