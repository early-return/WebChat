<template>
  <conversations class="conversations" :messages="messages"></conversations>
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
  mounted() {
  },
};
</script>

<style scoped>
</style>
