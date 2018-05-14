<template>
  <div id="app">
    <notice-bar></notice-bar>
    <main>
      <router-view></router-view>
    </main>
    <operation-box class="operation-box"></operation-box>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';
import {
  INITIALIZE,
} from '@/types/action-types';

import NoticeBar from '@/components/common/NoticeBar';
import OperationBox from '@/components/common/OperationBox';

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
  methods: {
  },
  watch: {
    // 监听是否已初始化及初始化后应跳转的页面
    initialized() {
      if (this.$store.getters.isInitialized) {
        if (!this.$store.getters.self) {
          this.$router.replace('/login');
        }
        if (this.$route.path === '/') {
          this.$router.replace('/chat');
        }
      }
    },
  },
  components: { NoticeBar, OperationBox },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

html,
body {
  height: 100vh;
  font-family: 'Source Sans Pro', 'Deng', 'Microsoft Yahei', 'SimHei', sans-serif;
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
  font-size: 1rem;
  border-radius: 16px;
  border: 0;
  text-decoration: none;
  transition: background-color 0.3s;
  letter-spacing: 2px;

  &:hover {
    background-color: darken($lightblue, 10%);
    cursor: pointer;
  }
}

input[type="text"],
input[type="email"],
input[type="password"] {
  display: inline-block;
  padding: 5px 10px;
  background-color: $white;
  font-size: 1rem;
  color: #444;
  border-radius: 16px;
  border: 1px solid darken($lightgray, 20%);
  outline: none;
  transition: border 0.3s;
  font-family: inherit;

  &:focus {
    border: 1px solid $lightblue;
  }
}

.container {
  width: 100%;
  max-width: $content-max-width;
  margin: 0 auto;
}

@media (min-width: $content-mobile-width) {
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

<style lang="scss" scoped>
.topbar {
  z-index: 1000;
  flex-shrink: 0;
}
#app {
  display: flex;
  flex-direction: column;

  .notice-bar {
    flex: 0 0 auto;
  }

  main {
    flex: 0 1 auto;
  }

  .operation-box {
    z-index: 1001;
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>

