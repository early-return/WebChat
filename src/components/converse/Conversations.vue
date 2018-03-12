<template>
  <div class="container">
    <div class="message" v-for="msg in messages" :key="msg.id">
      <img class="avatar" :src="msg.fromAvatar">
      <div class="desc">
        <div class="nickname">{{ msg.from }}</div>
        <div class="content">{{ msg.message }}</div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'conversations',
  props: ['messages'],
  data() {
    return {

    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.message {
  background-color: #fff;
  flex-shrink: 0;
  border-bottom: 2px solid #e6ecf0;
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
  color: #888;
}
</style>


