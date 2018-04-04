<template>
  <div class="home">
    <navbar class="navbar" :active="active"></navbar>
    <main class="container">
      <div class="user-info">
        <user-info class="user-info" :user="self"></user-info>
      </div>
      <router-view class="content"></router-view>
    </main>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
import UserInfo from '@/components/account/UserInfo';

export default {
  data() {
    return {
      active: 'Chat',
    };
  },
  computed: {
    self() {
      return this.$store.state.self;
    },
  },
  components: {
    Navbar,
    UserInfo,
  },
  beforeRouteUpdate(to, from, next) {
    this.active = to.name;
    next();
  },
};
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.navbar {
  flex: 0 0 auto;
}
.content {
  flex-grow: 1;
  overflow-y: auto;
}
main.container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 10px;
}

.user-info {
  width: 250px;
  margin-right: 10px;
  flex: 0 0 auto;
}

@media (max-width: $content-mobile-width) {
  .user-info {
    display: none;
  }
}
</style>


