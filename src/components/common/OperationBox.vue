<template>
  <div class="operation-box" v-if="showing">
    <div class="operation-box-box">
      <header>
        <div class="title">{{ payload.title }}</div>
        <div class="close-btn" @click="closeBox">x</div>
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
import {
  SHOW_NOTICE,
} from '@/types/action-types';

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
      if (!this.payload.validate(this.text)) {
        this.$store.dispatch(SHOW_NOTICE, { message: this.payload.message, type: 'error' });
        return;
      }
      if (this.payload.callback) {
        this.payload.callback(this.text);
      }
      this.closeBox();
    },
    closeBox() {
      this.$store.commit(OPERATION_BOX_SHOWING, false);
      this.text = '';
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
    position: relative;
    padding: 0;
    border-radius: 4px;
    box-shadow: 2px 2px 2px rgba($color: #888, $alpha: 0.8);

    header {
      margin: 20px 0;
      display: flex;
      justify-content: space-between;

      .title {
        color: $blue;
        font-weight: bold;
        font-size: 20px;
        border-left: 3px solid $blue;
        padding: 10px;
      }

      .close-btn {
        padding: 5px;
        width: 10px;
        height: 20px;
        line-height: 20px;
        position: absolute;
        right: 5px;
        top: 0;

        &:hover {
          cursor: pointer;
        }
      }
    }

    main {
      padding: 0 10px;

      input {
        box-sizing: border-box;
        width: 100%;
      }
    }

    footer {
      margin: 10px;
    }
  }
}
</style>


