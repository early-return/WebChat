<template>
  <div>加载中。。。</div>
</template>

<script>
import {
  TOPBAR_STATUS,
} from '@/types/mutation-types';

export default {
  created() {
    this.$store.commit(TOPBAR_STATUS, {
      type: 'title',
      canBack: false,
      backIcon: false,
      title: '欢迎使用',
    });
  },
};
</script>
