<template>

<div class="login">
  <title-bar title="欢迎使用"></title-bar>

  <div class="login-form">
    <input type="email" placeholder="请输入您的邮箱" v-model="email">
    <input type='text' autofocus placeholder="请输入您的名字" v-model="name" v-show="status === 'register'">
    <input type="password" autofocus v-show="status === 'login' || status === 'register'" placeholder="请输入您的密码" v-model="password">
    <input type="password" v-show="status === 'register'" v-model="rePassword">
    <a class="btn" href="#" @click="action">{{ button }}</a>
  </div>

</div>

</template>

<script>
import {
  LOGIN,
  REGISTER,
  CHECK_USER,
  SHOW_NOTICE,
} from '@/types/action-types';
import TitleBar from '@/components/common/TitleBar';

export default {
  name: 'login',
  data() {
    return {
      email: '',
      name: '',
      status: 'initial',
      password: '',
      rePassword: '',
      errorMessage: '',
    };
  },
  created() {
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
    self() {
      return this.$store.state.self;
    },
  },
  methods: {
    action() {
      const vm = this;
      const preStatus = vm.status;
      vm.status = 'waiting';
      if (preStatus === 'initial') {
        vm.$store.dispatch(CHECK_USER, vm.email)
          .then((result) => {
            if (result === 'exist') {
              vm.status = 'login';
            } else {
              vm.status = 'register';
            }
          });
      } else if (preStatus === 'login') {
        vm.$store.dispatch(LOGIN, {
          email: vm.email,
          password: vm.password,
        }).then(() => {
          vm.loginSuccess();
        }).catch(() => {
          vm.status = 'initial';
        });
      } else if (preStatus === 'register') {
        if (vm.password !== vm.rePassword) {
          vm.$store.dispatch(SHOW_NOTICE, { message: '两次输入的密码不一致', type: 'warning', timeout: 3000 });
          vm.status = 'register';
        } else {
          vm.$store.dispatch(REGISTER, {
            email: vm.email,
            name: vm.name,
            password: vm.password,
          }).then(() => {
            vm.loginSuccess();
          }).catch((err) => {
            vm.errorMessage = err;
          });
        }
      }
    },
    loginSuccess() {
      this.$router.replace('/chat');
    },
  },
  components: {
    TitleBar,
  },

};
</script>
<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-form {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
input {
  margin-bottom: 10px;
}
</style>


