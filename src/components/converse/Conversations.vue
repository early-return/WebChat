<template>
  <div class="container">
    <router-link class="message" :to="'/talk/' + msg.fromId" href="#" v-for="msg in messages" :key="msg.fromId">
      <img class="avatar" :src="msg.fromId === selfId ? msg.toAvatar : msg.fromAvatar">
      <div class="desc">
        <div class="nickname">{{ msg.fromId === selfId ? msg.to : msg.from }}</div>
        <div class="content">{{ (msg.fromId === selfId ? '我' : msg.from) + ': ' + msg.message }}</div>
      </div>
    </router-link>
  </div>

</template>

<script>
import bus from '@/bus';

export default {
  name: 'conversations',
  props: ['messages'],
  data() {
    return {
    };
  },
  computed: {
    selfId() {
      return bus.self ? bus.self.id : 0;
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: auto;
}
.message {
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


