import { workorderApi } from '../api/workorder';

export interface WechatConfig {
  appId: string;
  ghId: string;
}

export const WECHAT_CONFIG: WechatConfig = {
  appId: 'wx4e99627d3f0e6f62',
  ghId: 'gh_599d3fb43f57'
};

/**
 * 微信静默授权 - 获取code
 */
export const wechatSilentAuth = (redirectUrl?: string): boolean => {
  const currentUrl = redirectUrl || 'http://gongdan.jitujt.com';
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (!code) {
    const redirectUri = encodeURIComponent(currentUrl);
    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WECHAT_CONFIG.appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
    window.location.href = authUrl;
    return false;
  }
  return true;
};

/**
 * 获取微信用户openid
 */
export const getWechatOpenid = async (code: string): Promise<string | null> => {
  try {
    const response = await workorderApi.getWechatOpenid(code);
    if (response && response.openid) {
      console.log('获取openid成功:', response.openid);
      return response.openid;
    }
  } catch (error) {
    console.error('获取openid失败:', error);
  }
  return null;
};

/**
 * 检查URL中的code参数
 */
export const getWechatCode = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
};

/**
 * 清除URL中的code参数（可选）
 */
export const clearCodeFromUrl = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  window.history.replaceState({}, '', url.toString());
};
