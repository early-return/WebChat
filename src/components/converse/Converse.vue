<template>
    <div class="converse">
      <title-bar class="title-bar" title="与好友的聊天" canBack></title-bar>
      <conversation class="conversation" :messages="messages"></conversation>
      <input-bar class="input-bar" @post="sendMessage" button="发送"></input-bar>
    </div>
</template>

<script>
import Conversation from '@/components/converse/Conversation';
import InputBar from '@/components/common/InputBar';
import TitleBar from '@/components/common/TitleBar';


export default {
  name: 'converse',
  props: ['uid'],
  data() {
    return {
      messages: [],
      to: {},
    };
  },
  computed: {
    self() {
      return this.$store.state.self;
    },
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
        fromId: this.self.id,
        from: this.self.name,
        fromAvatar: this.self.avatar,
        name: 'Hehe',
        message: payload.text,
      });
    },
  },
  components: {
    Conversation,
    InputBar,
    TitleBar,
  },
};
</script>

<style scoped lang="scss">
.converse {
  height: 100vh;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title-bar {
  flex: 0 0 auto;
}
.input-bar {
  box-sizing: border-box;
  width: 100%;
  flex: 0 0 auto;
  max-width: 1000px;
  margin: 0 auto;
}
.conversation {
  flex-grow: 1;
  overflow: auto;
  box-sizing: border-box;
  max-width: $content-max-width;
  background-color: $white;
  border-bottom: 1px solid $lightgray;
  justify-content: flex-start;
  overflow-y: auto;
  padding: 10px;
}
</style>


