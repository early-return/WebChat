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
  props: ['uid'],
  data() {
    return {
      messages: [],
    };
  },
  created() {
    const vm = this;
    const id = vm.uid;
    vm.$http.get(`/api/messages/${id}`)
      .then((response) => {
        vm.messages = response.data;
      });
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

<style scoped lang="scss">
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
  background-color: $white;
  border-bottom: 1px solid $lightgray;
  justify-content: flex-start;
  padding: 10px;
}
</style>


