import { createStore, Store } from 'vuex';

export interface WechatState {
  openid: string | null;
  code: string | null;
  isAuthorized: boolean;
}

export interface RootState {
  wechat: WechatState;
}

export default createStore<RootState>({
  state: {
    wechat: {
      openid: localStorage.getItem('wechat_openid') || null,
      code: null,
      isAuthorized: !!localStorage.getItem('wechat_openid')
    }
  },
  
  getters: {
    getOpenid: (state: RootState) => state.wechat.openid,
    getCode: (state: RootState) => state.wechat.code,
    isAuthorized: (state: RootState) => state.wechat.isAuthorized
  },
  
  mutations: {
    setOpenid(state: RootState, openid: string) {
      state.wechat.openid = openid;
      state.wechat.isAuthorized = true;
      localStorage.setItem('wechat_openid', openid);
    },
    
    setCode(state: RootState, code: string) {
      state.wechat.code = code;
    },
    
    clearWechat(state: RootState) {
      state.wechat.openid = null;
      state.wechat.code = null;
      state.wechat.isAuthorized = false;
      localStorage.removeItem('wechat_openid');
    }
  },
  
  actions: {
    async initWechatAuth({ commit, state }) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        commit('setCode', code);
        return code;
      }
      
      return null;
    }
  }
});
