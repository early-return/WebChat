<template>
  <div class="user-info-panel">
    <header>
      <div class="user-info-back-bar">
        <img v-if="user && user.bgImage" :src="user.bgImage" :alt="user.name" class="user-info-back-img">
      </div>
    </header>
    <main class="user-info-content">
      <img class="user-info-avatar" v-if="user && user.avatar" :src="user.avatar" alt="用户头像">
      <p class="user-info-name">{{ user && user.name ? user.name : '' }}</p>
    </main>
    <footer>
      <router-link v-for="info in infos" :to="info.link" :key="info.title" class="user-info-item">
        <div class="user-info-item-title">{{ info.title }}</div>
        <div class="user-info-item-content">{{ info.content }}</div>
      </router-link>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'user-info',
  props: ['user', 'infos'],
};
</script>

<style lang="scss" scoped>
.user-info-panel {
  display: flex;
  flex-direction: column;
  background-color: $white;

  .user-info-back-bar {
    height: 100px;
    background-color: $blue;
  }

  .user-info-content {
    position: relative;
    min-height: 40px;

    .user-info-avatar {
      position: absolute;
      top: -25px;
      left: 10px;
      border: 3px solid $white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .user-info-name {
      position: absolute;
      font-weight: bold;
      top: -10px;
      left: 75px;
    }
  }

  &>footer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 10px;

    a {
      display: block;
      color: $blue;
      width: 33%;
      box-sizing: border-box;
      text-decoration: none;
      transition: color 0.3s;
      font-weight: bold;
      padding: 0.2em;
      text-align: center;

      .user-info-item-title {
        color: $gray;
        font-size: 0.8rem;
      }

      &:hover .user-info-item-title {
        color: $blue;
      }
    }
  }
}
</style>

