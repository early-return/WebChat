<template>
  <conversation :messages="messages"></conversation>
</template>

<script>
import Conversation from '@/components/converse/Conversation';

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
  },
};
</script>

