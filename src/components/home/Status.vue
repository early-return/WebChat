<template>
  <div class="status-list">
    <div class="status-item">
      <aside><img :src="self.avatar" class="status-avatar"></aside>
      <main>
        <input type="text" v-model="statusText" required>
        <button class="btn" @click="publishStatus">发布新动态</button>
      </main>
    </div>
    <div class="status-item notice" v-if="statusList.length < 1 && !loading && !hasMore">
      <aside></aside>
      <main>没有动态信息呢！自己发布一条或添加一些好友吧！</main>
    </div>
    <div class="status-item" v-if="statusList" v-for="status in statusList" :key="status._id">
      <aside><img class="status-avatar" :src="status.uavatar"></aside>
      <main>
        <div class="status-username">{{ status.uname }}</div>
        <div class="status-date">{{ status.date }}</div>
        <div class="status-content">{{ status.content }}</div>
      </main>
    </div>
    <div class="status-item loading-more" v-if="hasMore" @click="fetchMore">
      <aside></aside>
      <main>{{ loading ? '正在加载...' : '加载更多' }}</main>
    </div>
    <div class="status-item notice loading-more" v-if="!hasMore && statusList.length > 0">
      <aside></aside>
      <main>已经到底了哦！</main>
    </div>
  </div>
</template>

<script>
import {
  SHOW_NOTICE,
} from '@/types/action-types';
import cfg from '@/config';

export default {
  name: 'status',
  data() {
    return {
      statusText: '',
      statusList: [],
      currentPage: 1,
      perPageCount: 10,
      loading: true,
      hasMore: true,
    };
  },
  computed: {
    self() {
      return this.$store.state.self;
    },
  },
  created() {
    this.fetchMore();
  },
  methods: {
    publishStatus() {
      if (this.statusText.length < 1) {
        this.$store.dispatch(SHOW_NOTICE, { message: '请输入动态内容', type: 'warning', timeout: 3000 });
        return;
      }
      if (this.statusText.length > 140) {
        this.$store.dispatch(SHOW_NOTICE, { message: `动态内容最多140字！(当前${this.statusText.length}字)`, type: 'warning', timeout: 3000 });
        return;
      }
      this.$http.post(`${cfg.serverAddress}/api/status/post`, {
        uid: this.self._id,
        token: this.$store.state.token,
        data: {
          uid: this.self._id,
          uname: this.self.name,
          uavatar: this.self.avatar,
          content: this.statusText,
        },
      }).then((resp) => {
        this.statusList.unshift(resp.data.data);
      });
      this.statusText = '';
    },
    fetchMore() {
      const vm = this;
      vm.loading = true;
      const skip = (this.currentPage - 1) * this.perPageCount;
      const limit = this.perPageCount;
      const uid = this.self._id;
      const token = this.$store.state.token;
      vm.$http.get(`${cfg.serverAddress}/api/status/${skip}/${limit}/${uid}/${token}`)
        .then((resp) => {
          if (resp.data.data.length < 10) {
            vm.hasMore = false;
          }
          vm.statusList.push(...resp.data.data);
          vm.currentPage += 1;
          vm.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.status-list {
  margin-bottom: 10px;

  .notice {
    color: $gray;
  }

  .status-item {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid $lightlightblue;
    background-color: $white;
    transition: background-color .3s;

    &:hover {
      background-color: $lightlightblue;
    }

    aside {
      padding: 10px;

      .status-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }

    main {
      display: flex;
      flex-direction: column;
      padding: 10px;
      flex-grow: 1;
      align-items: flex-start;

      .status-username {
        font-weight: bold;
      }

      .status-date {
        color: $gray;
        font-size: 0.8em;
      }

      .status-content {
        margin-top: 10px;
        margin-bottom: 10px;
      }

      input[type=text] {
        width: 100%;
        box-sizing: border-box;
        margin-top: 5px;
        margin-bottom: 10px;
      }
    }
  }
  .loading-more {
    cursor: pointer;

    main {
      align-items: center;
    }
  }
}
</style>
