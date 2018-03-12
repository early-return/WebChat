<template>
  <div class="session">
    <div class="message" :class="{ self: msg.name === 'Hehe' }" v-for="msg in messages" :key="msg.id">
      <img class="avatar" src="../../assets/logo.png">
      <p class="bubble">{{ msg.message }}</p>
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
