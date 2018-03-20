<template>
  <conversations class="conversations" :messages="messages"></conversations>
</template>

<script>
import Conversations from '@/components/converse/Conversations';
import bus from '@/bus';

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
    bus.$emit(bus.changeTopbarStatus, {
      type: 'menu',
      active: 'chat',
    });
  },
};
</script>

<style scoped>
.conversations {
  padding: 10px 0;
}
</style>
