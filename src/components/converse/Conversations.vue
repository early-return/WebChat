<template>
  <main class="messages-container">
    <div class="messages">
      <router-link class="message" :to="`/talk/${msg.session}`" href="#" v-for="msg in messages" :key="msg._id">
        <img class="avatar" :src="getAvatar(msg.session)">
        <div class="desc">
          <div class="nickname">{{ getName(msg.session) }}</div>
          <div class="content">{{ `${getName(msg.fromId)}: ${msg.message}` }}</div>
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
    };
  },
  computed: {
    self() {
      return this.$store.state.self;
    },
  },
  methods: {
    getAvatar(id) {
      const friend = this.$store.getters.getFriendByUID(id);
      return friend.avatar;
    },
    getName(id) {
      if (id === this.self._id) {
        return '我';
      }
      return this.$store.getters.getFriendByUID(id).name;
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
.message .desc .content {
  font-size: 0.8em;
  color: lighten($gray, 10%);
}
</style>


