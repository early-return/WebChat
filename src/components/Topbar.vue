<template>
  <header class="topbar">
    <div class="container">
      <div class="topbar-item navbar" v-if="status.type === 'menu'">
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
      <div class="topbar-item title-bar" v-if="status.type === 'title'">
        <a class="nav-item" href="#" @click="goBack">
          <font-awesome-icon v-if="status.backIcon" class="icon" :icon="backIcon" />
          <span>{{ status.title }}</span>
        </a>
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
  faChevronLeft as backIcon,
} from '@fortawesome/fontawesome-free-solid';


export default {
  name: 'topbar',
  data() {
    return {
      backIcon,
    };
  },
  computed: {
    chatIcon() {
      return this.status.type === 'menu' && this.status.active === 'chat' ? chatIconSolid : chatIconReg;
    },
    groupIcon() {
      return this.status.type === 'menu' && this.status.active === 'group' ? groupIconSolid : groupIconReg;
    },
    statusIcon() {
      return this.status.type === 'menu' && this.status.active === 'status' ? statusIconSolid : statusIconReg;
    },
    status() {
      return this.$store.state.topbarStatus;
    },
  },
  methods: {
    goBack() {
      if (this.status.canBack) {
        if (window.history.length > 1) {
          this.$router.go(-1);
        } else {
          this.$router.push('/');
        }
      }
    },
  },
  components: {
    FontAwesomeIcon,
  },
};
</script>


<style scoped lang="scss">
.topbar {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: $gray;
  background-color: $white;
  box-shadow: 0 1px 1px darken($lightgray, 20%);
}
.topbar-item {
  display: flex;
  margin: 0 auto;
  justify-content: flex-start;
  align-items: center;
}
.topbar-item .icon {
  font-size: 18px;
  margin-right: 2px;
}

.topbar-item a {
  text-decoration: none;
  color: $gray;
}

.nav-item {
  padding-top: 11px;
  padding-bottom: 11px;
  padding-left: 18px;
  padding-right: 18px;
  height: 21px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 2px solid transparent;
  transition: border-bottom-color 0.2s, color 0.2s;
}

.nav-item.router-link-active,
.nav-item:hover {
  color: $active;
  border-bottom-color: $active;
}

.title-bar .nav-item {
  padding-left: 10px;
}
.title-bar .nav-item .icon {
  margin-right: 15px;
}
</style>

