<template>
  <div>
    <title-bar title="个人信息" canBack></title-bar>
    <div class="container">
      <div class="profile" :class="{'not-editing': notEditing}">
        <aside>
          <img class="avatar" :src="self.avatar" alt="用户头像">
          <button class="btn" @click="switchEditing">{{ notEditing ? '编辑' : '取消编辑' }}</button>
          <button class="btn" @click="save">保存</button>
        </aside>
        <main>
          <h3>个人信息</h3>
          <div class="profile-item">
            <label for="name">名字：</label>
            <input type="text" id="name" v-model="self.name" @change="onChange" :disabled="notEditing">
          </div>
          <div class="profile-item">
            <label for="email">邮箱：</label>
            <input type="email" id="email" v-model="self.email" @change="onChange" disabled>
          </div>
          <div class="profile-item">
            <label for="url">主页：</label>
            <input type="url" id="url" v-model="self.url" @change="onChange" :disabled="notEditing">
          </div>
          <div class="profile-item">
            <label for="bio">简介：</label>
            <div class="textarea" id="bio" @change="onChange" :contenteditable="!notEditing">{{ self.bio ? self.bio : '这家伙很懒，啥都没写。' }}</div>
          </div>
          <h3>密码修改</h3>
          <div class="profile-item">
            <label for="old">旧密码：</label>
            <input type="password" id="old">
          </div>
          <div class="profile-item">
            <label for="new">新密码：</label>
            <input type="password" id="new">
          </div>
          <div class="profile-item">
            <label for="re">重复新密码：</label>
            <input type="password" id="re">
          </div>
          <div class="profile-item">
            <button class="btn">修改密码</button>
          </div>
        </main>
      </div>

    </div>
  </div>
</template>

<script>
import TitleBar from '@/components/common/TitleBar';
import cfg from '@/config';
import util from '@/util';
import {
  SELF,
} from '@/types/mutation-types';
import {
  SHOW_NOTICE,
} from '@/types/action-types';

export default {
  data() {
    return {
      self: {},
      notEditing: true,
      changed: false,
    };
  },
  created() {
    this.self = { ...this.$store.state.self };
    this.changed = false;
  },
  methods: {
    switchEditing() {
      this.notEditing = !this.notEditing;
    },
    save() {
      if (!util.validateName(this.self.name)) {
        this.warn('名称只能包含汉字、字母、数字与下划线！');
        return;
      }
      if (this.self.url && !/\w+\.[a-zA-Z]+/.test(this.self.url)) {
        this.warn('主页地址格式不正确！');
        return;
      }
      const bio = document.querySelector('#bio').textContent;
      if (!this.changed && bio === this.self.bio) {
        this.$store.dispatch(SHOW_NOTICE, { message: '你还没有更改过你的资料哦！', type: 'warning', timeout: 3000 });
      } else {
        this.self.bio = bio;
        this.$http.post(`${cfg.serverAddress}/api/profile/update`, {
          token: this.$store.state.token,
          data: this.self,
        }).then((resp) => {
          this.$store.commit(SELF, resp.data.data);
          this.$store.dispatch(SHOW_NOTICE, { message: '修改成功！', type: 'success', timeout: 3000 });
          this.changed = false;
          this.notEditing = true;
        });
      }
    },
    onChange() {
      this.changed = true;
    },
    warn(notice) {
      this.$store.dispatch(SHOW_NOTICE, { message: notice, type: 'warning', timeout: 3000 });
    },
  },

  components: {
    TitleBar,
  },
};
</script>

<style lang="scss" scoped>
#email,
.not-editing textarea,
.not-editing .textarea,
.not-editing input[type="url"],
.not-editing input[type="text"] {
  border-color: transparent;
  background-color: transparent;
}

.profile {
  margin-top: 10px;
  display: flex;
  background-color: $white;
  flex-direction: row;

  aside {
    display: flex;
    flex-direction: column;
    align-items: center;

    .avatar {
      border-radius: 50%;
      margin: 30px;
      width: 200px;
      height: 200px;
    }

    .btn {
      margin: 10px;
    }
  }

  main {
    display: flex;
    background-color: $lightlightblue;
    flex-direction: column;
    padding: 10px;
    flex-grow: 1;

    .profile-item {
      margin: 5px;
    }
  }
}

@media (max-width: $content-mobile-width) {
  .profile {
    flex-direction: column;

    aside {
      flex-direction: row;

      .avatar {
        width: 100px;
        height: 100px;
        margin: 10px;
      }
    }
  }
}
</style>
