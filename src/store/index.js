import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import io from 'socket.io-client';

import config from '@/config';
import {
  TOKEN,
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

const baseUrl = `${config.serverAddress}/api`;

const store = new Vuex.Store({
  state: {
    // 用户登录后取得的令牌
    token: 'a',

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
    getFriendByUID: state => uid => state.friends.find(user => user._id === uid),
    recentMessages: state => Object.values(state.allMessages)
      .map(messages => messages[0])
      .sort((msg1, msg2) => msg1.date - msg2.date),
  },

  mutations: {
    [INITIALIZED](state, payload) {
      state.initialized = payload.status;
    },
    [TOKEN](state, token) {
      state.token = token;
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
      if (state.allMessages[message.session]) {
        state.allMessages[message.session].unshift(message);
      } else {
        state.allMessages[message.session] = [message];
      }
    },
  },

  actions: {
    // 初始化应用
    [INITIALIZE]({ state, commit, dispatch }) {
      if (localStorage.getItem('token')) {
        commit(TOKEN, localStorage.getItem('token'));
      }
      axios.get(`${baseUrl}/auth/${state.token}`)
        .then((response) => {
          if (response.data.success) {
            commit(SELF, response.data.data);
            socket.emit('auth', { token: state.token, uid: state.self._id });
            dispatch(FETCH_FRIENDS);
            dispatch(FETCH_MESSAGES);
          }
          commit(INITIALIZED, { status: true });
        }).catch(() => {
          commit(INITIALIZED, { status: true });
        });
    },

    // 请求 API 相关 Action
    [FETCH_MESSAGES]({ state, commit }) {
      axios.get(`${baseUrl}/messages/${state.self._id}/${state.token}`)
        .then((response) => {
          if (response.data.success) {
            commit(MESSAGES, {
              replace: true,
              messages: response.data.data,
            });
          }
        });
    },
    [FETCH_FRIENDS]({ state, commit }) {
      axios.get(`${baseUrl}/friends/${state.self._id}/${state.token}`)
        .then((response) => {
          if (response.data.success) {
            commit(FRIENDS, response.data.data);
          }
        });
    },
    [SEND_MESSAGE]({ state }, message) {
      socket.emit('message', { token: state.token, message });
    },
    [LOGIN]({ commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/login`, params)
          .then((response) => {
            if (response.data.success) {
              commit(TOKEN, response.data.data.token);
              commit(SELF, response.data.data.user);
              localStorage.setItem('token', response.data.data.token);
              dispatch(INITIALIZE);
              resolve(response.data.data.user);
            } else {
              reject(new Error(response.data.messages));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    [REGISTER]({ commit, dispatch }, params) {
      return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/register`, params)
          .then((response) => {
            if (response.data.success) {
              commit(TOKEN, response.data.data.token);
              commit(SELF, response.data.data.user);
              localStorage.setItem('token', response.data.data.token);
              dispatch(INITIALIZE);
              resolve(response.data.data.user);
            } else {
              reject(new Error(response.data.messages));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    [CHECK_USER](_, email) {
      return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/check/${email}`)
          .then((response) => {
            if (response.data.success) {
              resolve(response.data.data.status);
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
  store.commit(MESSAGE, data);
});

export default store;
