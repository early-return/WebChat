<template>
  <div class="session">
    <title-bar class="title-bar" :menu="menu" :title="title" canBack></title-bar>
    <main class="container">
      <aside class="user-info">
        <user-info :user="aside" :infos="aside.infos"></user-info>
      </aside>
      <main class="content-container">
        <div class="content">
          <conversation class="conversation" :messages="messages"></conversation>
          <input-bar class="input-bar" @post="sendMessage" button="发送"></input-bar>
        </div>
      </main>
    </main>
  </div>
</template>

<script>
import Conversation from '@/components/converse/Conversation';
import InputBar from '@/components/common/InputBar';
import TitleBar from '@/components/common/TitleBar';
import UserInfo from '@/components/account/UserInfo';


export default {
  name: 'session',
  props: [
    'id',
    'title',
    'messages',
    'aside',
    'menu',
  ],
  data() {
    return {
    };
  },
  mounted() {
    const conversation = document.querySelector('.conversation');
    conversation.scrollTop = conversation.scrollHeight;
  },
  computed: {
    self() {
      return this.$store.state.self;
    },
  },
  methods: {
    sendMessage(payload) {
      this.$emit('send', {
        toId: this.id,
        fromId: this.self._id,
        fromAvatar: this.self.avatar,
        fromName: this.self.name,
        message: payload.text,
      });
    },
  },
  components: {
    Conversation,
    InputBar,
    TitleBar,
    UserInfo,
  },
};
</script>

<style scoped lang="scss">
main.container {
  display: flex;
  height: 100%;
  flex-direction: row;

  .user-info {
    flex: 0 0 250px;
    margin-top: $margin-size;
    margin-right: $margin-size;
  }

  .content-container {
    position: relative;
    width: 100%;
    margin-top: $margin-size;

    .content {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;

      .conversation {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        max-width: $content-max-width;
        box-sizing: border-box;
        width: 100%;
        background-color: $white;
        border-bottom: 1px solid $lightgray;
        overflow-y: auto;
      }
    }
  }
}
.session {
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

@media (max-width: $content-mobile-width) {
  main.container {
    .user-info {
      display: none;
    }

    .content-container {
      margin-top: 0;
    }
  }
}
</style>


