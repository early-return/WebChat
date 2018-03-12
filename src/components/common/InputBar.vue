<template>
  <div class="input-bar">
    <textarea autocomplete="off" wrap="hard" v-model="text"></textarea><a class="button" href="#">{{ button }}</a>
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
  min-height: 1em;
  padding: 10px;
  font-size: 14px;
  border-radius: 10px;
  border: 1px solid #A5D5E8;
  background-color: #FFF;
  overflow-y: visible;
  outline: none;
}
.button {
  display: block;
  background-color: #4BACD2;
  padding: 8px 10px;
  font-size: 14px;
  border: 0;
  text-decoration: none;
  border-radius: 16px;
  color: #FFF;
  transform: background-color 0.3s;
}
.button:hover {
  background-color: #1F98C7;
}
</style>



