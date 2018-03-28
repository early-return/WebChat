<template>
  <div id="app">
    <topbar class="topbar"></topbar>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';
import Topbar from '@/components/Topbar';
import {
  INITIALIZE,
} from '@/types/action-types';
import {
  TOPBAR_STATUS,
} from '@/types/mutation-types';

export default {
  name: 'app',
  data() {
    return {

    };
  },
  created() {
    const vm = this;
    vm.$store.dispatch(INITIALIZE);
  },
  computed: {
    ...mapGetters({
      initialized: 'isInitialized',
    }),
  },
  mounted() {

  },
  methods: {
  },
  components: {
    Topbar,
    self() {
      return this.$store.state.self;
    },
  },
  watch: {
    // 监听是否已初始化及初始化后应跳转的页面
    initialized() {
      if (this.$store.getters.isInitialized) {
        if (this.$store.getters.self) {
          this.$router.replace('/chat');
        } else {
          this.$router.replace('/login');
        }
      }
    },
    // 监听路由变化以改变导航栏样式
    $route(to) {
      let active = '';
      if (to.name === 'Chat') {
        active = 'chat';
      } else if (to.name === 'Group') {
        active = 'group';
      } else if (to.name === 'Status') {
        active = 'status';
      }
      if (to.name === 'Chat' || to.name === 'Group' || to.name === 'Status') {
        const status = {
          type: 'menu',
          active,
        };
        this.$store.commit(TOPBAR_STATUS, status);
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

