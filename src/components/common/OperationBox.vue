<template>
  <div class="operation-box" v-if="showing">
    <div class="operation-box-box">
      <header>
        <div class="title">{{ payload.title }}</div>
        <div class="close-btn" @click="close">x</div>
      </header>
      <main><input type="text" v-model="text"></main>
      <footer>
        <div class="btn" @click="onCallback">确定</div>
      </footer>
    </div>
  </div>
</template>

<script>
import {
  OPERATION_BOX_SHOWING,
} from '@/types/mutation-types';

export default {
  name: 'operation-box',
  data() {
    return {
      text: '',
    };
  },
  computed: {
    showing() {
      return this.$store.state.operationBoxShowing;
    },
    payload() {
      return this.$store.state.operationBoxPayload;
    },
  },
  methods: {
    onCallback() {
      if (this.payload.callback) {
        this.payload.callback(this.text);
      }
      close();
    },
    close() {
      this.$store.commit(OPERATION_BOX_SHOWING, false);
    },
  },
};
</script>

<style lang="scss" scoped>
.operation-box {
  width: 100vw;
  height: 100vh;
  background-color: rgba(100, 100, 100, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  .operation-box-box {
    background-color: #fff;
    padding: 10px 15px;
    box-shadow: 2px 2px 2px rgba($color: #888, $alpha: 0.8);

    header {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;

      .title {
        color: $blue;
        font-weight: bold;
        font-size: 20px;
        margin-right: 10px;
      }

      .close-btn {
        padding: 5px;

        &:hover {
          cursor: pointer;
        }
      }
    }

    main {

      input {
        box-sizing: border-box;
        width: 100%;
      }
    }

    footer {
      margin-top: 10px;
    }
  }
}
</style>


