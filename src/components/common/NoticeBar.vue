<template>
  <div v-if="showing" class="notice-bar" :class="type">
    <div class="container">
      <div class="notice-message">{{ message }}</div>
      <div class="close-btn" @click="closeError">x</div>
    </div>
  </div>
</template>

<script>
import {
  NOTICE_SHOWING,
} from '@/types/mutation-types';

export default {
  name: 'notice-bar',
  data() {
    return {
    };
  },
  computed: {
    showing() {
      return this.$store.state.noticeShowing;
    },
    message() {
      return this.$store.state.noticeMessage;
    },
    type() {
      return this.$store.state.noticeType;
    },
  },
  methods: {
    closeError() {
      this.$store.commit(NOTICE_SHOWING, false);
    },
  },
};
</script>

<style lang="scss" scoped>
.notice-bar {
  color: #FFFFFF;
  padding: 5px 0 5px 0;
  font-size: 14px;
  background-color: #337ab7;

  &:hover {
    background-color: #286090;
  }

  .container {
    display: flex;

    .notice-message {
      flex: 1 0 auto;
    }
    .close-btn {
      flex: 0 0 auto;
    }
  }

  &.error {
    background-color: #d9534f;

    &:hover {
      background-color: #C9302C;
    }
  }

  &.info {
    background-color: #5bc0de;

    &:hover {
      background-color: #31B0D5;
    }
  }

  &.success {
    background-color: #5cb85c;

    &:hover {
      background-color: #449D44;
    }
  }

  &.warning {
    background-color: #f0ad4e;

    &:hover {
      background-color: #EC971F;
    }
  }
}

@media (max-width: $content-mobile-width) {
  .notice-bar {
    padding: 5px;
  }
}
</style>


