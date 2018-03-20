<template>

  <div class="login-form">
    <input type="text" placeholder="请输入您的邮箱" v-model="email">
    <input type="password" :class="{'no-display' : status !== 'login' && status !== 'register'}" placeholder="请输入您的密码" v-model="password">
    <input type="password" :class="{'no-display' : status !== 'register'}" placeholder="请再次输入您的密码" v-model="rePassword">
    <a class="btn" href="#" @click="action">{{ button }}</a>
  </div>

</template>

<script>
import bus from '@/bus';

export default {
  name: 'login',
  data() {
    return {
      email: '',
      status: 'initial',
      password: '',
      rePassword: '',
      errorMessage: '',
    };
  },
  created() {
    bus.$emit(bus.changeTopbarStatus, {
      type: 'title',
      active: 'chat',
      backIcon: false,
      canBack: false,
      title: '开始使用',
    });
  },
  computed: {
    button() {
      let button = '开始';
      if (this.status === 'login') {
        button = '登录';
      }
      if (this.status === 'register') {
        button = '注册';
      }
      if (this.status === 'waiting') {
        button = '请等待...';
      }
      return button;
    },
  },
  methods: {
    action() {
      const vm = this;
      const preStatus = vm.status;
      vm.status = 'waiting';
      if (preStatus === 'initial') {
        vm.$http.get(`/api/auth/${vm.email}`)
          .then((response) => {
            if (response.data.status === 'exist') {
              vm.status = 'login';
            } else {
              vm.status = 'register';
            }
          });
      } else if (preStatus === 'login') {
        vm.$http.post('/api/login', {
          email: vm.email,
          password: vm.password,
        }).then((response) => {
          if (response.data.user) {
            bus.$emit(bus.changeSelf, response.data.user);
            vm.$router.push('/chat');
          } else {
            vm.emailerrorMessage = response.data.message;
          }
        });
      } else if (preStatus === 'register') {
        if (vm.password !== vm.rePassword) {
          vm.errorMessage = '两次密码输入不一致';
        } else {
          vm.$http.post('/api/register', {
            email: vm.email,
            password: vm.password,
          }).then((response) => {
            if (response.data.user) {
              bus.$emit(bus.changeSelf, response.data.user);
            } else {
              vm.errorMessage = response.data.message;
            }
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.no-display {
  display: none;
}
input {
  margin-bottom: 10px;
}
</style>


