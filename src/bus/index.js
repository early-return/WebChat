import Vue from 'vue';

export default new Vue({
  name: 'bus',
  data() {
    return {
      self: null,
      changeTopbarStatus: 'changeTopbarStatus',
      changeSelf: 'changeSelf',
    };
  },
  created() {
    const self = this;
    self.$on(this.changeSelf, (id) => {
      self.self = id;
    });
  },
});
