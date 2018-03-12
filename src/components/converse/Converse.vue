<template>
    <div class="container">
      <conversation class="conversation" :messages="messages"></conversation>
      <input-bar class="input-bar" @post="sendMessage" button="发送"></input-bar>
    </div>
</template>

<script>
import Conversation from '@/components/converse/Conversation';
import InputBar from '@/components/common/InputBar';

export default {
  name: 'converse',
  data() {
    return {
      messages: [
      ],
    };
  },
  methods: {
    sendMessage(payload) {
      this.messages.unshift({
        id: this.messages[this.messages.length - 1].id + 1,
        name: 'Hehe',
        message: payload.text,
      });
    },
  },
  components: {
    Conversation,
    InputBar,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.input-bar {
  box-sizing: border-box;
  width: 100%;
  flex-shrink: 0;
  max-width: 1000px;
  margin: 0 auto;
}
.conversation {
  flex-grow: 1;
  overflow: auto;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid #e6ecf0;
  justify-content: flex-start;
  padding: 10px;
}
</style>


