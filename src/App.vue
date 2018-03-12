<template>
  <div id="app">
    <topbar class="topbar"></topbar>
    <main>
      <div class="container">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import Topbar from '@/components/Topbar';

export default {
  name: 'app',
  data() {
    return {

    };
  },
  methods: {
  },
  components: {
    Topbar,
  },
};
</script>

<style>
body {
  padding: 0;
  margin: 0;
  background-color: #e6ecf0;
}

.container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

main {
  margin-top: 55px;
  display: flex;
  justify-content: center;
}
</style>

<style scoped>
.top-bar {
  border-bottom: 1px solid #e6ecf0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  z-index: 1000;
}
</style>

