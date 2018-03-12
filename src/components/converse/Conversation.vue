<template>
  <div class="session">
    <div class="message" v-if="messages" :class="{ self: msg.name === 'Hehe' }" v-for="msg in messages" :key="msg.id">
      <img class="avatar" :src="msg.fromAvatar">
      <p class="bubble">{{ msg.message }}</p>
    </div>
    <div class="no-message" v-if="!messages || messages.length === 0">
      还没有聊天记录，发送第一条消息开始聊天吧！
    </div>
  </div>
</template>

<script>
export default {
  name: 'conversation',
  props: ['messages'],
  data() {
    return {

    };
  },
};
</script>

<style scoped>
.session {
  padding: 15px;
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  align-items: flex-start;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.message {
  max-width: 80%;
  display: flex;
  flex-shrink: 0;
  align-items: flex-end;
  padding-top: 10px;
  padding-bottom: 10px;
}
.message .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.message .bubble {
  background-color: #E6ECF0;
  word-break: break-all;
  padding: 10px;
  margin: 0 10px 0 10px;
  border-radius: 15px 15px 15px 0;
}
.message.self .bubble {
  border-radius: 15px 15px 0 15px;
  order: 1;
}
.message.self .avatar {
  order: 2;
}
.message.self {
  align-self: flex-end;
}
.no-message {
  background-color: #E6ECF0;
  border-radius: 15px;
  align-self: center;
  padding: 5px 10px;
  color: #888;
  margin: auto 0;
}

@media (max-width: 1000px) {
  .session {
    background-color: #E6ECF0;
  }
  .message .bubble {
    background-color: #FFF;
  }
  .no-message {
    background-color: #FFF;
  }
}

</style>
