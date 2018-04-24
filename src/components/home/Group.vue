<template>
    <conversations class="conversations" :messages="messages"></conversations>
</template>

<script>
import Conversations from '@/components/converse/Conversations';

export default {
  name: 'group',
  data() {
    return {

    };
  },
  computed: {
    messages() {
      return this.$store.getters.recentMessages;
    },
  },
  created() {
  },
  methods: {
    fetchMessages() {
    },
  },
  components: {
    Conversations,
  },
};
</script>

<style scoped>
</style>
