<template>
  <header class="topbar">
    <div class="container">
      <div class="topbar-item title-bar">
        <a class="nav-item" href="#" @click="goBack">
          <font-awesome-icon v-if="canBack" class="icon" :icon="backIcon" />
          <span>{{ title }}</span>
        </a>
      </div>
      <div class="menu" v-if="menu">
        <font-awesome-icon class="menu-icon" @click="switchMenu" :icon="menuIcon" />
        <div class="menu-content" v-if="showingMenu">
          <div v-for="item in menu" :key="item.title" @click="item.callback" class="menu-item">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import {
  faChevronLeft as backIcon,
  faBars as menuIcon,
} from '@fortawesome/fontawesome-free-solid';


export default {
  name: 'title-bar',
  data() {
    return {
      backIcon,
      menuIcon,
      showingMenu: false,
    };
  },
  props: {
    canBack: {
      type: Boolean,
      default: false,
    },
    title: String,
    menu: Array,
  },
  methods: {
    switchMenu() {
      this.showingMenu = !this.showingMenu;
    },
    goBack() {
      if (this.canBack) {
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
  z-index: 1000;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: $gray;
  background-color: $white;
  box-shadow: 0 1px 1px darken($lightgray, 20%);

  .container {
    position: relative;

    .menu {
      position: absolute;
      top: 0;
      right: 0;

      .menu-icon {
        width: 18px;
        height: 18px;
        padding-top: 13px;
        padding-bottom: 13px;
        position: absolute;
        top: 0;
        right: 0;

        &:hover {
          cursor: pointer;
        }
      }

      .menu-content {
        position: absolute;
        width: 6rem;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        box-shadow: 0px 0px 5px rgba(150, 150, 150, 0.8);
        top: 45px;
        right: 0;

        .menu-item {
          display: block;
          width: 100%;
          box-sizing: border-box;
          text-decoration: none;
          text-align: center;
          background-color: #fff;
          padding: 10px 15px;
          border-top: 1px olid #eee;
          color: #66757f;

          &:hover {
            cursor: pointer;
          }
        }

        hr {
          width: 100%;
          margin: 0;
          box-sizing: border-box;
          border: 1px solid #eee;
        }
      }
    }
  }
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

.title-bar .nav-item {
  padding-left: 10px;
}
.title-bar .nav-item .icon {
  margin-right: 15px;
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

  &.router-link-active,
  &:hover {
    color: $active;
    border-bottom-color: $active;
  }
}

@media (max-width: $content-mobile-width) {
  .topbar .container .menu .menu-icon {
    padding-left: 13px;
    padding-right: 13px;
  }
}
</style>

