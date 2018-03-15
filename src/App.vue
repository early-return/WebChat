<template>
  <div id="app">
    <topbar :status="topBarStatus" :self-id="self ? self.id : 0" class="topbar"></topbar>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Topbar from '@/components/Topbar';

export default {
  name: 'app',
  data() {
    return {
      self: null,
    };
  },
  created() {
    const vm = this;
    vm.$http('/api/self')
      .then((response) => {
        vm.self = response.data;
      });
  },
  computed: {
    topBarStatus() {
      const active = this.$route.path.split('/')[1];
      const type = active === 'chat' || active === 'group' || active === 'status' ? 'menu' : 'title';
      const title = '与好友的聊天';
      return {
        type,
        active,
        title,
        backIcon: true,
        canBack: true,
      };
    },
  },
  mounted() {

  },
  methods: {
  },
  components: {
    Topbar,
  },
  watch: {
    self() {
      if (!this.self) {
        this.$router.push('/status');
      } else {
        this.$router.push(`/chat/${this.self.id}`);
      }
    },
  },
};
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
}
#app {
  display: flex;
  overflow: auto;
  flex-direction: column;
}
body {
  padding: 0;
  margin: 0;
  background-color: $lightgray;
}

.container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

main {
  flex-grow: 1;
  display: flex;
  overflow: auto;
  justify-content: center;
}
*,
html {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
*::-webkit-scrollbar {
  display: none;
}
</style>

<style scoped>
.topbar {
  z-index: 1000;
  flex-shrink: 0;
}
</style>

