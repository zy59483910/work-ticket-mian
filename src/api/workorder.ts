import { request } from './request';

/**
 * 工单保存请求参数接口
 */
export interface MainSaveReqVO {
  /**
   * 工单类型ID（关联工单类型表主键）
   */
  workorderTypeId: number;
  /**
   * 工单标题
   */
  workorderTitle: string;
  /**
   * 工单内容（支持长文本）
   */
  workorderContent: string;
  /**
   * 处理人ID（维护人员ID）
   */
  handlerId: number;
  /**
   * 用户认证状态1确认2拒绝
   */
  userAuthStatus?: number;
  /**
   * 用户认证时间
   */
  userAuthTime?: string;
  /**
   * 用户认证意见
   */
  userAuthContent?: string;
  /**
   * 工单状态（0待处理 1处理中 2已完成 3已驳回）
   */
  workorderStatus: number;
  /**
   * 处理内容
   */
  handleContent?: string;
  /**
   * 处理时间
   */
  handleTime?: string;
  /**
   * 工单等级（0普通 1紧急 2加急）
   */
  level: number;
  /**
   * 发起人电话
   */
  initiatorPhone?: string;
  /**
   * 发起人姓名
   */
  initiatorName?: string;
  /**
   * 发起人openid（微信/第三方标识）
   */
  initiatorOpenid?: string;
  /**
   * 通知人员（admin用户）
   */
  noticeIds?: string;
  /**
   * 通知人员数组（前端使用）
   */
  noticeIdsArray?: number[];
}

/**
 * 工单列表请求参数接口
 */
export interface WorkorderListReqVO {
  /**
   * 页码，从 1 开始
   */
  pageNo: number;
  /**
   * 每页条数，最大值为 100
   */
  pageSize: number;
  /**
   * 工单编号（业务唯一标识，如WO20260119001）
   */
  workorderNo?: string;
  /**
   * 工单类型ID（关联工单类型表主键）
   */
  workorderTypeId?: number;
  /**
   * 工单标题
   */
  workorderTitle?: string;
  /**
   * 工单内容（支持长文本）
   */
  workorderContent?: string;
  /**
   * 处理人ID（维护人员ID）
   */
  handlerId?: number;
  /**
   * 工单状态（0待处理 1处理中 2已完成 3已驳回）
   */
  workorderStatus?: number;
  /**
   * 处理内容
   */
  handleContent?: string;
  /**
   * 处理时间
   */
  handleTime?: string;
  /**
   * 工单等级（0普通 1紧急 2加急）
   */
  level?: number;
  /**
   * 发起人电话
   */
  initiatorPhone?: string;
  /**
   * 发起人姓名
   */
  initiatorName?: string;
  /**
   * 发起人openid（微信/第三方标识）
   */
  initiatorOpenid?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 处理人手机号
   */
  handlerMobile?: string;
}

/**
 * 工单列表响应项接口
 */
export interface WorkorderItem {
  /**
   * 工单ID
   */
  id: number;
  /**
   * 工单编号（业务唯一标识，如WO20260119001）
   */
  workorderNo?: string;
  /**
   * 工单类型ID
   */
  workorderTypeId: number;
  /**
   * 工单类型名称
   */
  workorderTypeName?: string;
  /**
   * 工单标题
   */
  workorderTitle: string;
  /**
   * 工单内容
   */
  workorderContent: string;
  /**
   * 处理人ID
   */
  handlerId: number;
  /**
   * 处理人姓名
   */
  handlerName?: string;
  /**
   * 用户认证状态
   */
  userAuthStatus?: number;
  /**
   * 用户认证时间
   */
  userAuthTime?: string;
  /**
   * 用户认证意见
   */
  userAuthContent?: string;
  /**
   * 工单状态
   */
  workorderStatus: number;
  /**
   * 工单状态名称
   */
  workorderStatusName?: string;
  /**
   * 处理内容
   */
  handleContent: string;
  /**
   * 处理时间
   */
  handleTime: string;
  /**
   * 工单等级
   */
  level: number;
  /**
   * 工单等级名称
   */
  levelName?: string;
  /**
   * 发起人电话
   */
  initiatorPhone: string;
  /**
   * 发起人姓名
   */
  initiatorName: string;
  /**
   * 发起人openid
   */
  initiatorOpenid: string;
  /**
   * 通知人员
   */
  noticeIds: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 维护人员手机号
   */
  handlerMobile?: string;
  /**
   * 维护人员信息
   */
  handlerInfo?: {
    /**
     * 创建时间
     */
    createTime?: string;
    /**
     * 更新时间
     */
    updateTime?: string;
    /**
     * 创建者
     */
    creator?: string;
    /**
     * 更新者
     */
    updater?: string;
    /**
     * 删除标记
     */
    deleted?: boolean;
    /**
     * 租户ID
     */
    tenantId?: number;
    /**
     * ID
     */
    id?: number;
    /**
     * 用户名
     */
    username?: string;
    /**
     * 密码
     */
    password?: string;
    /**
     * 昵称
     */
    nickname?: string;
    /**
     * 工号
     */
    jobNumber?: string;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 部门ID
     */
    deptId?: number;
    /**
     * 部门名称
     */
    deptName?: string;
    /**
     * 岗位ID列表
     */
    postIds?: number[];
    /**
     * 邮箱
     */
    email?: string;
    /**
     * 手机号
     */
    mobile?: string;
    /**
     * 性别
     */
    sex?: number;
    /**
     * 头像
     */
    avatar?: string;
    /**
     * 状态
     */
    status?: number;
    /**
     * 登录IP
     */
    loginIp?: string;
    /**
     * UKey
     */
    ukey?: string;
    /**
     * 登录时间
     */
    loginDate?: string;
    /**
     * 角色名称
     */
    roleNames?: string;
  };
  /**
   * 工单类型
   */
  workorderType?: {
    /**
     * 创建时间
     */
    createTime?: string;
    /**
     * 更新时间
     */
    updateTime?: string;
    /**
     * 创建者
     */
    creator?: string;
    /**
     * 更新者
     */
    updater?: string;
    /**
     * 删除标记
     */
    deleted?: boolean;
    /**
     * ID
     */
    id?: number;
    /**
     * 类型名称
     */
    typeName?: string;
    /**
     * 类型描述
     */
    typeDesc?: string;
    /**
     * 状态
     */
    status?: number;
  };
}

/**
 * 分页响应接口
 */
export interface PageResponse<T> {
  /**
   * 响应码
   */
  code: number;
  /**
   * 响应数据
   */
  data: {
    /**
     * 工单列表
     */
    list: T[];
    /**
     * 总量
     */
    total: number;
  };
  /**
   * 响应消息
   */
  msg: string;
}

/**
 * 工单API接口
 */
export const workorderApi = {
  /**
   * 创建工单
   * @param data 工单数据
   */
  createWorkorder(data: MainSaveReqVO): Promise<number> {
    return request.post<number>('/workorder/app/main/create', data);
  },
  
  /**
   * 获取工单列表
   * @param params 查询参数
   */
  getWorkorderList(params: WorkorderListReqVO): Promise<PageResponse<WorkorderItem>> {
    return request.get<PageResponse<WorkorderItem>>('/workorder/app/main/page', params);
  },
  
  /**
   * 获取工单详情
   * @param id 工单ID
   */
  getWorkorderDetail(id: number): Promise<WorkorderItem> {
    return request.get<WorkorderItem>(`/workorder/app/main/get?id=${id}`);
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
};