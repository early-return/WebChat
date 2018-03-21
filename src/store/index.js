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
    getMessagesByUID: state => uid => state.messages[`${uid}`],
  },
  mutations: {
    [INITIALIZED](state, payload) {
      state.initialized = payload.status;
    },
    [SELF](state, payload) {
      state.self = payload.self;
    },
    [TOPBAR_STATUS](state, payload) {
      state.topbarStatus = payload.status;
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
      commit(INITIALIZED, {
        status: true,
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
  },
});
