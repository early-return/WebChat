<template>
  <div class="input-bar">
    <input type="text" placeholder="在此输入您想发送的信息" autocomplete="off" wrap="hard" v-model="text"><a class="btn" @click="post" href="#">{{ button }}</a>
  </div>
</template>

<script>
export default {
  name: 'input-bar',
  props: ['button'],
  data() {
    return {
      text: '',
    };
  },
  methods: {
    post() {
      this.$emit('post', { text: this.text });
      this.text = '';
    },
  },
};
</script>

<style scoped lang="scss">
.input-bar {
  display: flex;
  background-color: $lightlightblue;
  padding: 10px;
  align-items: flex-end;
}
input {
  flex-grow: 1;
  margin-right: 10px;
}
</style>



