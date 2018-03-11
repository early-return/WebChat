<template>
  <div id="app">
    <topbar></topbar>
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
}

main {
  margin-top: 55px;
  display: flex;
  justify-content: center;
}
</style>
