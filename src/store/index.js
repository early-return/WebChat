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
  NOTICE_MESSAGE,
  NOTICE_SHOWING,
  NOTICE_TYPE,
} from '@/types/mutation-types';
import {
  INITIALIZE,
  FETCH_MESSAGES,
  FETCH_FRIENDS,
  LOGIN,
  LOGOUT,
  SEND_MESSAGE,
  REGISTER,
  CHECK_USER,
  SHOW_NOTICE,
} from '@/types/action-types';

Vue.use(Vuex);

const socket = io(config.socketAddress);

const baseUrl = `${config.serverAddress}/api`;

let firstConnected = false;

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

    noticeMessage: 'This is a error!',
    noticeShowing: false,
    noticeType: 'info',


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
    [NOTICE_MESSAGE](state, msg) {
      state.noticeMessage = msg;
    },
    [NOTICE_SHOWING](state, showing) {
      state.noticeShowing = showing;
    },
    [NOTICE_TYPE](state, type) {
      state.noticeType = type;
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
    [SHOW_NOTICE]({ commit }, payload) {
      commit(NOTICE_MESSAGE, payload.message);
      commit(NOTICE_SHOWING, true);
      commit(NOTICE_TYPE, payload.type ? payload.type : 'notice');
      if (payload.timeout && payload.timeout > 0) {
        setTimeout(() => { commit(NOTICE_SHOWING, false); }, payload.timeout);
      }
    },

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
              dispatch(SHOW_NOTICE, { message: response.data.message, type: 'error', timeout: 3000 });
              reject(new Error(response.data.messages));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    [LOGOUT]({ state, commit, dispatch }) {
      axios.post(`${baseUrl}/logout`, {
        token: state.token,
        uid: state.self._id,
      }).then((response) => {
        if (response.data.success) {
          dispatch(SHOW_NOTICE, { message: '登出成功！', type: 'success', timeout: 3000 });
          localStorage.removeItem('token');
          commit(TOKEN, 'a');
          commit(SELF, null);
        }
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
              dispatch(SHOW_NOTICE, { message: response.data.message, type: 'error' });
              reject(new Error(response.data.messages));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },


    // 请求 API 相关 Action
    [FETCH_MESSAGES]({ state, commit, dispatch }) {
      axios.get(`${baseUrl}/messages/${state.self._id}/${state.token}`)
        .then((response) => {
          if (response.data.success) {
            commit(MESSAGES, {
              replace: true,
              messages: response.data.data,
            });
          } else {
            dispatch(SHOW_NOTICE, { message: response.data.message, type: 'error' });
          }
        });
    },
    [FETCH_FRIENDS]({ state, commit, dispatch }) {
      axios.get(`${baseUrl}/friends/${state.self._id}/${state.token}`)
        .then((response) => {
          if (response.data.success) {
            commit(FRIENDS, response.data.data);
          } else {
            dispatch(SHOW_NOTICE, { message: response.data.message, type: 'error' });
          }
        });
    },
    [SEND_MESSAGE]({ state }, message) {
      socket.emit('message', { token: state.token, message });
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

socket.on('info', (data) => {
  if (!data.success) {
    store.dispatch(SHOW_NOTICE, { message: data.message, type: 'error' });
  }
});

socket.on('connect', () => {
  firstConnected = true;
});

socket.on('connect_error', () => {
  store.dispatch(SHOW_NOTICE, { message: '与服务器的连接发生错误！', type: 'error' });
});

socket.on('connect_timeout', () => {
  store.dispatch(SHOW_NOTICE, { message: '连接超时！', type: 'error' });
});

socket.on('disconnect', () => {
  store.dispatch(SHOW_NOTICE, { message: '与服务器的连接已断开！', type: 'error' });
});

socket.on('reconnect_attempt', (attemptNumber) => {
  store.dispatch(SHOW_NOTICE, { message: `正在尝试重新连接服务器！(${attemptNumber})`, type: 'info' });
});

socket.on('reconnect_error', () => {
  store.dispatch(SHOW_NOTICE, { message: '重连失败！', type: 'error' });
});

socket.on('reconnect', () => {
  store.dispatch(SHOW_NOTICE, { message: '已成功连接到服务器！', type: 'success', timeout: 3000 });
  if (!firstConnected) {
    store.dispatch(INITIALIZE);
    firstConnected = true;
  }
});
export default store;
