<template>
  <div class="input-bar">
    <textarea autocomplete="off" wrap="hard" v-model="text"></textarea><a class="button" @click="post" href="#">{{ button }}</a>
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

<style scoped>
.input-bar {
  display: flex;
  background-color: #E8F4F9;
  padding: 10px;
  align-items: flex-end;
}
textarea {
  flex-grow: 1;
  margin-right: 10px;
  height: 16px;
  padding: 5px 10px;
  font-size: 14px;
  resize: none;
  border-radius: 15px;
  border: 1px solid #A5D5E8;
  background-color: #FFF;
  overflow: hidden;
  outline: none;
}
.button {
  display: block;
  background-color: #4BACD2;
  padding: 5px 10px;
  font-size: 14px;
  border: 0;
  text-decoration: none;
  border-radius: 15px;
  color: #FFF;
  transform: background-color 0.3s;
}
.button:hover {
  background-color: #1F98C7;
}
</style>



