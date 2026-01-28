import { request } from './request';
/**
 * 工单API接口
 */
export const workorderApi = {
  /**
   * 创建工单
   * @param data 工单数据
   */
  createWorkorder(data: any): Promise<number> {
    return request.post<number>('/workorder/app/main/create', data);
  },
  
  /**
   * 获取工单列表
   * @param params 查询参数
   */
  getWorkorderList(params: any): Promise<any> {
    return request.get<any>('/workorder/app/main/page', params);
  },
  
  /**
   * 获取工单详情
   * @param id 工单ID
   */
  getWorkorderDetail(id: number): Promise<any> {
    return request.get<any>(`/workorder/app/main/get?id=${id}`);
  },

  /**
   * 获得系统信息分页
   */
  getSystemInfoPage(): Promise<any> {
    return request.get<any>('/workorder/app/system-info/page', {
      pageNum: 1,
      pageSize: 100
    });
  },
  
  /**
   * 获取工单类型列表
   */
  getWorkorderTypes(): Promise<any> {
    return request.get<any>('/workorder/app/type/page', {
      pageNum: 1,
      pageSize: 100
    });
  },

  // 获得系统维护人员分页
  getHandlerPage(params: any): Promise<any> {
    return request.get<any>('/workorder/app/admin/page', params);
  },

  // 用户认证结果
  updateUserAuthStatus(data: any): Promise<any> {
    return request.post<any>('/workorder/app/main/update-status', data);
  },

  /**
   * 获取微信用户openid
   * @param code 微信授权code
   */
  getWechatOpenid(code: string): Promise<{ openid: string }> {
    return request.get<{ openid: string }>('/workorder/wx/code2openid', { code });
  },
};