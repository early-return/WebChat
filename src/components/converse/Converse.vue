<template>
  <div class="content">
    <div class="container">
      <conversation class="conversation" :messages="messages"></conversation>
      <input-bar class="input-bar" button="发送"></input-bar>
    </div>
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
  components: {
    Conversation,
    InputBar,
  },
};
</script>

<style scoped>
.content {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  border: 1px solid #e6ecf0;
  left: 0;
  bottom: 0;
}
.input-bar {
  box-sizing: border-box;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}
.conversation {
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid #e6ecf0;
  padding: 10px;
}
</style>


