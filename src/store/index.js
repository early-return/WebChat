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
  FRIEND,
  MESSAGES,
  MESSAGE,
  NOTICE_MESSAGE,
  NOTICE_SHOWING,
  NOTICE_TYPE,
  OPERATION_BOX_SHOWING,
  OPERATION_BOX_PAYLOAD,
  GROUPS,
  GROUP,
  GROUP_MESSAGES,
  GROUP_MESSAGE,
} from '@/types/mutation-types';
import {
  INITIALIZE,
  FETCH_MESSAGES,
  FETCH_FRIENDS,
  LOGIN,
  LOGOUT,
  SEND_MESSAGE,
  SEND_GROUP_MESSAGE,
  REGISTER,
  CHECK_USER,
  SHOW_NOTICE,
  SHOW_OPERATION_BOX,
  ADD_FRIEND,
  FETCH_GROUPS,
  FECTH_GROUPS_MESSAGES,
  ADD_GROUP,
  CREATE_GROUP,
} from '@/types/action-types';

Vue.use(Vuex);

const socket = io(config.socketAddress);

const baseUrl = `${config.serverAddress}/api`;

const store = new Vuex.Store({
  state: {
    // 用户登录后取得的令牌
    token: '',

    // 当前已登录的用户信息
    self: null,

    // 是否已完成初始化
    initialized: false,

    // 缓存中的消息列表
    allMessages: {},

    // 好友列表
    friends: [],

    // 群组列表
    groups: [],

    // 群消息列表
    groupMessages: {},

    // 提示信息相关
    noticeMessage: 'This is a error!',
    noticeShowing: false,
    noticeType: 'info',

    // 操作盒子相关
    operationBoxShowing: false,
    operationBoxPayload: { title: 'this is title' },

  },

  getters: {
    isInitialized: state => state.initialized,
    self: state => state.self,
    getMessagesByUID: state => uid => state.allMessages[uid],
    getGroupMessagesByUID: state => id => state.groupMessages[id],
    getFriendByID: state => uid => state.friends.find(user => user._id === uid),
    getGroupByID: state => id => state.groups.find(group => group._id === id),
    recentMessages: state => Object.values(state.allMessages)
      .map(messages => messages[0])
      .sort((msg1, msg2) => new Date(msg2.date) - new Date(msg1.date)),
    recentGroupMessages: state => Object.values(state.groupMessages)
      .map(messages => messages[0])
      .sort((msg1, msg2) => new Date(msg2.date) - new Date(msg1.date)),
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
    [OPERATION_BOX_SHOWING](state, showing) {
      state.operationBoxShowing = showing;
    },
    [OPERATION_BOX_PAYLOAD](state, payload) {
      state.operationBoxPayload = payload;
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
    [GROUPS](state, groups) {
      state.groups = groups;
    },
    [GROUP](state, group) {
      state.groups.push(group);
    },
    [GROUP_MESSAGES](state, messages) {
      state.groupMessages = messages;
    },
    [GROUP_MESSAGE](state, message) {
      if (state.groupMessages[message.gid]) {
        state.groupMessages[message.gid].unshift(message);
      } else {
        Vue.set(state.groupMessages, message.gid, [message]);
      }
    },
    [FRIEND](state, friend) {
      state.friends.push(friend);
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
        Vue.set(state.allMessages, message.session, [message]);
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

    [SHOW_OPERATION_BOX]({ commit }, payload) {
      commit(OPERATION_BOX_SHOWING, true);
      commit(OPERATION_BOX_PAYLOAD, payload);
    },

    // 初始化应用
    [INITIALIZE]({ state, commit, dispatch }) {
      if (localStorage.getItem('token')) {
        commit(TOKEN, localStorage.getItem('token'));
      }
      if (!state.token) {
        commit(INITIALIZED, { status: true });
        return;
      }
      axios.get(`${baseUrl}/auth/${state.token}`)
        .then((response) => {
          if (response.data.success) {
            commit(SELF, response.data.data);
            socket.emit('auth', { token: state.token, uid: state.self._id });
            dispatch(FETCH_FRIENDS);
            dispatch(FETCH_MESSAGES);
            dispatch(FETCH_GROUPS);
            dispatch(FECTH_GROUPS_MESSAGES);
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
      return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/logout`, {
          token: state.token,
          uid: state.self._id,
        }).then((response) => {
          if (response.data.success) {
            dispatch(SHOW_NOTICE, { message: '登出成功！', type: 'success', timeout: 3000 });
            localStorage.removeItem('token');
            commit(TOKEN, '');
            commit(SELF, null);
            resolve();
          } else {
            dispatch(SHOW_NOTICE, { message: response.data.message, type: 'error', timeout: 3000 });
            reject(new Error(response.data.message));
          }
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
              dispatch(SHOW_NOTICE, { message: response.data.message, type: 'error' });
              reject(new Error(response.data.messages));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    [ADD_FRIEND]({ state, commit, dispatch }, email) {
      axios.post(`${baseUrl}/friends/add`, {
        token: state.token,
        fromId: state.self._id,
        toEmail: email,
      }).then((response) => {
        if (response.data.success) {
          console.log(response);
          commit(FRIEND, response.data.data);
          dispatch(SHOW_NOTICE, { message: '好友添加成功！', type: 'success', timeout: 3000 });
        } else {
          dispatch(SHOW_NOTICE, { message: response.data.message, type: 'error' });
        }
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
    [FETCH_GROUPS]({ state, commit }) {
      axios.get(`${baseUrl}/groups/${state.self._id}/${state.token}`)
        .then((response) => {
          commit(GROUPS, response.data.data);
        });
    },
    [FECTH_GROUPS_MESSAGES]({ state, commit }) {
      axios.get(`${baseUrl}/messages/group/${state.self._id}/${state.token}`)
        .then((response) => {
          commit(GROUP_MESSAGES, response.data.data);
        });
    },
    [ADD_GROUP]({ state, commit, dispatch }, gname) {
      axios.post(`${baseUrl}/groups/join`, {
        token: state.token,
        uid: state.self._id,
        gname,
      }).then((data) => {
        commit(GROUP, data.data.data);
        dispatch(SHOW_NOTICE, { message: '已加入该群组！', type: 'success', timeout: 3000 });
      });
    },
    [CREATE_GROUP]({ state, commit, dispatch }, gname) {
      axios.post(`${baseUrl}/groups/create`, {
        token: state.token,
        uid: state.self._id,
        gname,
      }).then((data) => {
        commit(GROUP, data.data.data);
        dispatch(SHOW_NOTICE, { message: '已成功创建该群组！', type: 'success', timeout: 3000 });
      });
    },
    [SEND_MESSAGE]({ state }, message) {
      socket.emit('message', { token: state.token, message });
    },
    [SEND_GROUP_MESSAGE]({ state }, message) {
      socket.emit('group message', { token: state.token, message });
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

axios.interceptors.response.use((response) => {
  if (!response.data.success) {
    store.dispatch(SHOW_NOTICE, { message: response.data.message, type: 'error' });
    return Promise.reject(new Error(response.data.err));
  }
  return response;
}, (err) => {
  store.dispatch(SHOW_NOTICE, { message: `服务器错误： ${err.message}`, type: 'error' });
  Promise.reject(err);
});

socket.on('message', (data) => {
  store.commit(MESSAGE, data);
});

socket.on('group message', (data) => {
  console.log('on group message: ', data);
  store.commit(GROUP_MESSAGE, data);
});

socket.on('info', (data) => {
  store.dispatch(SHOW_NOTICE, { message: data.message, type: 'info', timeout: 3000 });
});

socket.on('success', (data) => {
  store.dispatch(SHOW_NOTICE, { message: data.message, type: 'success', timeout: 3000 });
});

socket.on('error', (data) => {
  store.dispatch(SHOW_NOTICE, { message: data.message, type: 'error' });
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
  store.dispatch(INITIALIZE);
});
export default store;
