<template>
  <div id="app">
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';
import {
  INITIALIZE,
} from '@/types/action-types';

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
    self() {
      return this.$store.state.self;
    },
  },
  mounted() {

  },
  methods: {
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
  },
};
</script>

<style lang="scss">
html,
body {
  height: 100vh;
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

@media (min-width: 1000px) {
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 10px;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.1);
  }
}



</style>

<style scoped>
.topbar {
  z-index: 1000;
  flex-shrink: 0;
}
</style>

