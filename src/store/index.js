import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import io from 'socket.io-client';

import config from '@/config';
import {
  SELF,
  INITIALIZED,
  FRIENDS,
  MESSAGES,
  MESSAGE,
} from '@/types/mutation-types';
import {
  INITIALIZE,
  FETCH_MESSAGES,
  FETCH_FRIENDS,
  LOGIN,
  SEND_MESSAGE,
  REGISTER,
  CHECK_USER,
} from '@/types/action-types';

Vue.use(Vuex);

const socket = io(config.socketAddress);

const store = new Vuex.Store({
  state: {
    // 当前已登录的用户信息
    self: null,

    // 是否已完成初始化
    initialized: false,

    // 缓存中的消息列表
    allMessages: {},

    // 好友列表
    friends: [],

  },

  getters: {
    isInitialized: state => state.initialized,
    self: state => state.self,
    getMessagesByUID: state => uid => state.allMessages[`${uid}`],
    getFriendByUID: state => uid => state.friends.find(user => user.id === Number(uid)),
    recentMessages: state => Object.values(state.allMessages)
      .map(messages => messages[0])
      .sort((msg1, msg2) => msg1.date - msg2.date),
  },

  mutations: {
    [INITIALIZED](state, payload) {
      state.initialized = payload.status;
    },
    [SELF](state, self) {
      state.self = self;
    },
    [FRIENDS](state, friends) {
      state.friends = friends;
    },
    [MESSAGES](state, payload) {
      if (payload.replace) {
        state.allMessages = payload.messages;
      } else {
        Vue.set(state.allMessages, payload.uid, payload.messages);
      }
    },
    [MESSAGE](state, message) {
      if (state.allMessages[message.toId]) {
        state.allMessages[message.toId].unshift(message);
      } else {
        state.allMessages[message.toId] = [message];
      }
    },
  },

  actions: {
    // 初始化应用
    [INITIALIZE]({ commit, dispatch }) {
      axios.get('/api/auth')
        .then((response) => {
          if (response.data.success) {
            commit(SELF, response.data.data);
            dispatch(FETCH_MESSAGES);
            dispatch(FETCH_FRIENDS);
          }
          commit(INITIALIZED, { status: true });
        }).catch(() => {
          commit(INITIALIZED, { status: true });
        });
    },

    // 请求 API 相关 Action
    [FETCH_MESSAGES]({ commit }) {
      axios.get('/api/messages/all')
        .then((response) => {
          if (response.data.success) {
            commit(MESSAGES, {
              replace: true,
              messages: response.data.data,
            });
          }
        });
    },
    [FETCH_FRIENDS]({ commit }) {
      axios.get('/api/friends')
        .then((response) => {
          if (response.data.success) {
            commit(FRIENDS, response.data.data);
          }
        });
    },
    [SEND_MESSAGE](_, message) {
      socket.emit('message', { message });
    },
    [LOGIN]({ commit }, params) {
      return new Promise((resolve, reject) => {
        axios.post('/api/login', params)
          .then((response) => {
            if (response.data.success) {
              commit(SELF, response.data.data);
              resolve(response.data.data);
            } else {
              reject(new Error(response.data.messages));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    [REGISTER]({ commit }, params) {
      return new Promise((resolve, reject) => {
        axios.post('/api/register', params)
          .then((response) => {
            if (response.data.success) {
              commit(SELF, response.data.data);
              resolve(response.data.data);
            } else {
              reject(new Error(response.data.messages));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    [CHECK_USER](email) {
      return new Promise((resolve, reject) => {
        axios.get(`/api/check_user/${email}`)
          .then((response) => {
            if (response.data.success) {
              resolve(response.data.status);
            } else {
              reject(new Error(response.data.message));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});

socket.on('message', (data) => {
  store.commit(MESSAGE, data.message);
});

export default store;
