import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';


import {
  SELF,
  INITIALIZED,
  TOPBAR_STATUS,
  MESSAGES_ALL,
  MESSAGES_FOR_SOMEONE,
  MESSAGES_RECENT,
} from '@/types/mutation-types';
import {
  INITIALIZE,
  FETCH_MESSAGES,
  FETCH_RECENT_MESSAGES,
  LOGIN,
  REGISTER,
  CHECK_USER,
} from '@/types/action-types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    self: null,
    initialized: false,
    topbarStatus: {},
    messages: {},
    messagesRecent: {},
  },
  getters: {
    isInitialized: state => state.initialized,
    self: state => state.self,
    getMessagesByUID: state => uid => state.messages[`${uid}`],
  },
  mutations: {
    [INITIALIZED](state, payload) {
      state.initialized = payload.status;
    },
    [SELF](state, self) {
      state.self = self;
    },
    [TOPBAR_STATUS](state, status) {
      state.topbarStatus = status;
    },
    [MESSAGES_ALL](state, payload) {
      if (payload.replace) {
        state.messages = payload.messages;
      } else {
        Vue.set(state.messages, payload.uid, payload.messages);
      }
    },
    [MESSAGES_FOR_SOMEONE](state, payload) {
      if (payload.replace) {
        state.messages[payload.uid] = payload.messages;
      } else {
        state.messages[payload.uid].push(payload.messages);
      }
    },
    [MESSAGES_RECENT](state, payload) {
      if (payload.replace) {
        state.messagesRecent = payload.messages;
      } else {
        state.messagesRecent.push(payload.messages);
      }
    },
  },
  actions: {
    [INITIALIZE]({ commit }) {
      axios.get('/api/auth')
        .then((response) => {
          if (response.data.user) {
            commit(SELF, response.data.user);
          }
          commit(INITIALIZED, { status: true });
        }).catch(() => {
          commit(INITIALIZED, { status: true });
        });
    },
    [FETCH_MESSAGES]({ commit }, payload) {
      axios.get(`/api/messages/${payload.uid}`)
        .then(response => commit(MESSAGES_FOR_SOMEONE, {
          replace: true,
          uid: payload.uid,
          messages: response.data,
        }));
    },
    [FETCH_RECENT_MESSAGES]({ commit }) {
      axios.get('/api/recent')
        .then(response => commit(MESSAGES_RECENT, {
          replace: true,
          messages: response.data,
        }));
    },
    [LOGIN]({ commit }, params) {
      return new Promise((resolve, reject) => {
        axios.post('/api/login', params)
          .then((response) => {
            commit(SELF, response.data.user);
            resolve(response.data.user);
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
            commit(SELF, response.data.user);
            resolve(response.data.user);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    [CHECK_USER](store, email) {
      return new Promise((resolve, reject) => {
        axios.get(`/api/check_user/${email}`)
          .then((response) => {
            resolve(response.data.status);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});
