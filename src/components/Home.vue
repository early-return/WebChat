<template>
  <div class="home">
    <navbar class="navbar" :active="active"></navbar>
    <main class="container">
      <div class="user-info">
        <user-info :user="self" :infos="selfInfo"></user-info>
      </div>
      <div class="content-container">
        <div class="content">
          <router-view class="content-main"></router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from '@/components/common/Navbar';
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
    selfInfo() {
      return [
        { title: '好友', link: '/friends', content: this.$store.state.friends.length },
        { title: '动态', link: '/status', content: 12 },
      ];
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

main.container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;

  .user-info {
    width: 250px;
    margin-right: $margin-size;
    margin-top: $margin-size;
    flex: 0 0 auto;
  }

  .content-container {
    flex-grow: 1;
    overflow-y: auto;
    position: relative;
    flex: 1 0 auto;

    .content {
      position: absolute;
      padding-top: $margin-size;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}

@media (max-width: $content-mobile-width) {
  .user-info {
    display: none;
  }
}
</style>


