<template>
  <conversations class="conversations" :messages="messages" :self-id="sid"></conversations>
</template>

<script>
import Conversations from '@/components/converse/Conversations';

export default {
  name: 'chat',
  data() {
    return {
      messages: [],
    };
  },
  props: ['sid'],
  created() {
    this.fetchMessages();
  },
  methods: {
    fetchMessages() {
      const vm = this;
      vm.$http.get('/api/messages/recent')
        .then((response) => {
          vm.messages = response.data;
        });
    },
  },
  components: {
    Conversations,
  },
};
</script>

<style scoped>
.conversations {
  padding: 10px 0;
}
</style>
