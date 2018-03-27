<template>

  <div class="login-form">
    <input type="email" placeholder="请输入您的邮箱" v-model="email">
    <input type="password" autofocus :class="{'no-display' : status !== 'login' && status !== 'register'}" placeholder="请输入您的密码" v-model="password">
    <input type="password" :class="{'no-display' : status !== 'register'}" placeholder="请再次输入您的密码" v-model="rePassword">
    <a class="btn" href="#" @click="action">{{ button }}</a>
  </div>

</template>

<script>
import {
  TOPBAR_STATUS,
} from '@/types/mutation-types';
import {
  LOGIN,
  REGISTER,
  CHECK_USER,
} from '@/types/action-types';

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
    this.$store.commit(TOPBAR_STATUS, {
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
        }).catch((err) => {
          vm.errorMessage = err;
        });
      } else if (preStatus === 'register') {
        if (vm.password !== vm.rePassword) {
          vm.errorMessage = '两次密码输入不一致';
        } else {
          vm.$stoer.dispatch(REGISTER, {
            email: vm.email,
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
      this.$router.push('/chat');
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


