<template>
  <div>加载中。。。</div>
</template>

<script>
import bus from '@/bus';

export default {
  data() {
    return {
    };
  },
  created() {
    bus.$on(bus.changeSelf, (self) => {
      if (!self) {
        this.$router.push('/login');
      } else {
        this.$router.push('/chat');
      }
    });
  },
};
</script>
