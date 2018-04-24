<template>
  <conversations class="conversations" :messages="messages"></conversations>
</template>

<script>
import Conversations from '@/components/converse/Conversations';

export default {
  name: 'chat',
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
