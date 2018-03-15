<template>
    <conversations class="conversations" :messages="messages"></conversations>
</template>

<script>
import Conversations from '@/components/converse/Conversations';

export default {
  name: 'group',
  data() {
    return {
      messages: [],
    };
  },
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
