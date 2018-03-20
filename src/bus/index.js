import Vue from 'vue';

export default new Vue({
  name: 'bus',
  data() {
    return {
      self: null,
      topbarStatus: {
        type: 'title',
        active: '',
        backIcon: false,
        canBack: false,
        title: '正在初始化',
      },
      changeTopbarStatus: 'changeTopbarStatus',
      changeSelf: 'changeSelf',
    };
  },
  created() {
    const self = this;
    self.$on(this.changeSelf, (id) => {
      self.self = id;
    });

    self.$on(this.changeTopbarStatus, (status) => {
      self.topbarStatus = status;
    });
  },
});
