<template>
  <header class="topbar">
      <div class="container">
        <div class="navbar">
          <router-link to="/chat" class="nav-item nav-item-chat" href="#">
            <font-awesome-icon class="icon" :icon="chatIcon" />
            <span class="/text">聊天</span>
          </router-link>
          <router-link to="/group" class="nav-item nav-item-group" href="#">
            <font-awesome-icon class="icon" :icon="groupIcon" />
            <span class="text">群聊</span>
          </router-link>
          <router-link to="/status" class="nav-item nav-item-status" href="#">
            <font-awesome-icon class="icon" :icon="statusIcon" />
            <span class="text">动态</span>
          </router-link>
        </div>
      </div>
    </header>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import {
  faCommentAlt as chatIconReg,
  faComments as groupIconReg,
  faStar as statusIconReg,
} from '@fortawesome/fontawesome-free-regular';
import {
  faCommentAlt as chatIconSolid,
  faComments as groupIconSolid,
  faStar as statusIconSolid,
} from '@fortawesome/fontawesome-free-solid';

export default {
  name: 'topbar',
  data() {
    return {

    };
  },
  props: ['activated'],
  computed: {
    chatIcon() {
      return this.$route.path === '/chat' ? chatIconSolid : chatIconReg;
    },
    groupIcon() {
      return this.$route.path === '/group' ? groupIconSolid : groupIconReg;
    },
    statusIcon() {
      return this.$route.path === '/status' ? statusIconSolid : statusIconReg;
    },
  },
  components: {
    FontAwesomeIcon,
  },
};
</script>


<style scoped lang="scss">
.topbar {
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #66757f;
  background-color: #fff;
  box-shadow: 0 0px 1px #888;
}



.navbar {
  display: flex;
  margin: 0 auto;
}

.navbar a {
  text-decoration: none;
  color: $gray;
}

.nav-item {
  padding-top: 11px;
  padding-bottom: 11px;
  padding-left: 18px;
  padding-right: 18px;
  height: 21px;
  border-bottom: 2px solid transparent;
  transition: border-bottom-color 0.2s, color 0.2s;
}

.nav-item .icon {
  font-size: 18px;
  margin-right: 2px;
}

.nav-item.router-link-active,
.nav-item:hover {
  color: $active;
  border-bottom-color: $active;
}

</style>

