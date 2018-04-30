<template>
  <div class="friend-add">
    <title-bar title="添加好友" :canBack="true"></title-bar>
    <div>添加好友</div>
  </div>
</template>

<script>
import TitleBar from '@/components/common/TitleBar';

export default {
  name: 'friend-add',
  data() {
    return {};
  },
  components: { TitleBar },
};
</script>
