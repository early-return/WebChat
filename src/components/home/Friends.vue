<template>
  <div>
    <div class="title">好友</div>
    <router-link class="friend" v-for="friend in friends" :key="friend._id" :to="`/talk/${friend._id}`">
      <img class="avatar" :src="friend.avatar"><div class="name">{{ friend.name }}</div>
    </router-link>
    <div class="title">群组</div>
    <router-link class="friend" v-for="group in groups" :key="group._id" :to="`/group/${group._id}`">
      <img class="avatar" src="/static/img/avatar/unknown.png"><div class="name">{{ group.name }}</div>
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
    groups() {
      return this.$store.state.groups;
    },
    unknowns() {
      return this.$store.state.unknownFriends;
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 1.2em;
  padding: 10px;
  background-color: #fff;
  color: #333;
  border-left: 3px solid $blue;
  margin: 5px 0;
}

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


