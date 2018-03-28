<template>
<div class="home">
  <navbar class="navbar" :active="active"></navbar>
  <router-view class="content"></router-view>  
</div>
</template>

<script>
import Navbar from '@/components/Navbar';

export default {
  data() {
    return {
      active: '',
    };
  },
  components: {
    Navbar,
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
</style>


