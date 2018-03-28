<template>
  <header class="topbar">
    <div class="container">
      <div class="topbar-item title-bar">
        <a class="nav-item" href="#" @click="goBack">
          <font-awesome-icon v-if="canBack" class="icon" :icon="backIcon" />
          <span>{{ title }}</span>
        </a>
      </div>
    </div>
  </header>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import {
  faChevronLeft as backIcon,
} from '@fortawesome/fontawesome-free-solid';


export default {
  name: 'title-bar',
  data() {
    return {
      backIcon,
    };
  },
  props: {
    canBack: {
      type: Boolean,
      default: false,
    },
    title: String,
  },
  computed: {
  },
  methods: {
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
</style>

