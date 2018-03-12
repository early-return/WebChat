<template>
  <div class="session">
    <div class="message" :class="{ self: msg.name === 'Hehe' }" v-for="msg in messages" :key="msg.id">
      <img class="avatar" src="../assets/logo.png">
      <p class="bubble">{{ msg.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'session',
  data() {
    return {
      messages: [
        {
          id: 1,
          name: 'Hehe',
          message: 'Hello!',
        },
        {
          id: 2,
          name: 'Haha',
          message: 'World!World!World!World!World!World!World!World!World!World!World!World!World!World!World!World!World!World!World!World!World!World!World!',
        },
        {
          id: 3,
          name: 'Hehe',
          message: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
        },
        {
          id: 4,
          name: 'Haha',
          message: 'World!',
        },
        {
          id: 5,
          name: 'Hehe',
          message: 'Hello!',
        },
        {
          id: 6,
          name: 'Haha',
          message: 'World!',
        },
        {
          id: 7,
          name: 'Hehe',
          message: 'Hello!',
        },
        {
          id: 8,
          name: 'Haha',
          message: 'World!',
        },
        {
          id: 9,
          name: 'Hehe',
          message: 'Hello!',
        },
        {
          id: 10,
          name: 'Haha',
          message: 'World!',
        },
        {
          id: 11,
          name: 'Hehe',
          message: 'Hello!',
        },
        {
          id: 12,
          name: 'Haha',
          message: 'World!',
        },
      ],
    };
  },
};
</script>

<style scoped>
.session {
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  align-items: flex-start;
}
.message {
  max-width: 80%;
  display: flex;
  align-items: flex-end;
  margin-top: 10px;
  margin-bottom: 10px;
}
.message .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.message .bubble {
  background-color: lightblue;
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

</style>
