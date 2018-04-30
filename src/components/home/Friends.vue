<template>
  <div>
    <router-link class="friend" v-for="friend in friends" :key="friend._id" :to="`/talk/${friend._id}`">
      <img class="avatar" :src="friend.avatar"><div class="name">{{ friend.name }}</div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'friends',
  data() {
    return {};
  },
  computed: {
    friends() {
      return this.$store.state.friends;
    },
  },
};
</script>

<style lang="scss" scoped>
.friend {
  display: flex;
  align-items: center;
  background: #FFF;
  text-decoration: none;
  color: #333;
  padding: 10px 15px;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .name {
    margin-left: 10px;
  }
}
</style>


