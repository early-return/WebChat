<template>
  <div id="app">
    <topbar class="topbar"></topbar>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Topbar from '@/components/Topbar';
import Bus from '@/bus';

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
        Bus.$emit(Bus.changeSelf, response.data);
      });
  },
  computed: {
    topBarStatus() {

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
    $route() {
      const active = this.$route.path.split('/')[1];
      const type = active === 'chat' || active === 'group' || active === 'status' ? 'menu' : 'title';
      const title = '与好友的聊天';
      Bus.$emit(Bus.changeTopbarStatus, {
        type,
        active,
        title,
        backIcon: true,
        canBack: true,
      });
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

.btn {
  display: inline-block;
  padding: 5px 10px;
  background-color: $lightblue;
  color: $white;
  font-size: 14px;
  border-radius: 15px;
  text-decoration: none;
  transition: background-color 0.3s;
  letter-spacing: 2px;

  &:hover {
    background-color: darken($lightblue, 10%);
  }
}

input[type="text"],
input[type="email"],
input[type="password"] {
  display: inline-block;
  padding: 5px 10px;
  background-color: $white;
  font-size: 14px;
  border-radius: 15px;
  border: 1px solid darken($lightgray, 20%);
  outline: none;
  transition: border 0.3s;

  &:focus {
    border: 1px solid $lightblue;
  }
}

.container {
  width: 100%;
  max-width: $content-max-width;
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

