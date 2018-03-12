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
html,
body,
#app {
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
}
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
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

</style>

<style scoped>
.topbar {
  z-index: 1000;
  flex-shrink: 0;
}
</style>

