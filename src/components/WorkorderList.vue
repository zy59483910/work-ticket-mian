<template>
  <div class="workorder-list">
    <!-- 头部 -->
    <div class="header">
      <div class="header-left"></div>
      <div class="header-title">工单列表</div>
      <div class="header-right">
        <button @click="goToSubmit" class="header-btn">
          <span class="header-btn-icon">+</span>
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 搜索框 -->
      <div class="search-bar">
        <input 
          v-model="searchKeyword" 
          type="text" 
          class="search-input" 
          placeholder="搜索工单编号/标题/内容"
          @keyup.enter="search"
        />
        <button class="search-btn" @click="search">
          <span class="search-icon">🔍</span>
        </button>
      </div>

      <!-- 状态筛选 -->
      <div class="status-filter">
        <button 
          v-for="status in statusOptions" 
          :key="status.value"
          :class="['status-btn', { active: activeStatus === status.value }]"
          @click="filterByStatus(status.value)"
        >
          {{ status.label }}
        </button>
      </div>

      <!-- 工单列表 -->
      <div class="list" v-if="workorders.length > 0">
        <div 
          v-for="workorder in workorders" 
          :key="workorder.id" 
          class="list-item"
          @click="goToDetail(workorder.id)"
        >
          <!-- 工单头部信息 -->
          <div class="workorder-header">
            <div class="workorder-title">{{ workorder.workorderTitle }}</div>
            <div :class="['status-tag', `status-${workorder.workorderStatus}`]">
              {{ getStatusName(workorder.workorderStatus) }}
            </div>
          </div>

          <!-- 工单类型和等级 -->
          <div class="workorder-meta">
            <span class="meta-item">
              类型：{{ workorder.workorderTypeName || '未知' }}
            </span>
            <span class="meta-item">
              等级：{{ getLevelName(workorder.level) }}
            </span>
          </div>

          <!-- 工单内容摘要 -->
          <div class="workorder-content">
            {{ getContentSummary(workorder.workorderContent) }}
          </div>

          <!-- 工单时间信息 -->
          <div class="workorder-footer">
            <div class="workorder-time">
              {{ formatTime(workorder.createTime) }}
            </div>
            <div class="workorder-handler">
              处理人：{{ workorder.handlerName || '未分配' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading" class="empty">
        <div class="empty-icon">📋</div>
        <div class="empty-text">暂无工单数据</div>
      </div>

      <!-- 加载状态 -->
      <div v-else class="loading">
        <div class="loading-icon">⏳</div>
        <div class="loading-text">加载中...</div>
      </div>

      <!-- 分页加载 -->
      <div v-if="!loading && workorders.length > 0 && hasMore" class="load-more">
        <button @click="loadMore" class="load-more-btn">
          加载更多
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { WorkorderItem } from '../api/workorder';

// 路由实例
const router = useRouter();

// 加载状态
const loading = ref(false);
// 搜索关键词
const searchKeyword = ref('');
// 当前激活的状态筛选
const activeStatus = ref(-1);
// 工单列表
const workorders = ref<WorkorderItem[]>([]);
// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});
// 是否有更多数据
const hasMore = ref(true);

// 状态选项
const statusOptions = [
  { label: '全部', value: -1 },
  { label: '待处理', value: 0 },
  { label: '处理中', value: 1 },
  { label: '已完成', value: 2 },
  { label: '已驳回', value: 3 },
];

/**
 * 获取工单列表
 */
const getWorkorderList = async (isLoadMore = false) => {
  if (loading.value) return;

  try {
    loading.value = true;

    // 如果是加载更多，页码+1
    if (!isLoadMore) {
      pagination.page = 1;
      workorders.value = [];
    }

    // 构建请求参数
    // const params = {
    //   page: pagination.page,
    //   pageSize: pagination.pageSize,
    //   workorderStatus: activeStatus.value === -1 ? undefined : activeStatus.value,
    //   // 实际项目中应该传递搜索关键词
    //   // keyword: searchKeyword.value,
    // };

    // 调用API获取工单列表
    // 实际项目中应该调用真实API
    // const response = await workorderApi.getWorkorderList(params);
    // workorders.value = isLoadMore ? [...workorders.value, ...response.list] : response.list;
    // pagination.total = response.total;
    // pagination.page = response.pageNum;
    // hasMore.value = workorders.value.length < response.total;

    // 模拟数据
    const mockData: WorkorderItem[] = [
      {
        id: 1,
        workorderTypeId: 12435,
        workorderTypeName: '设备故障',
        workorderTitle: '打印机无法打印',
        workorderContent: '办公室打印机无法正常打印，尝试重启后仍然无法使用，请尽快处理。',
        handlerId: 1,
        handlerName: '张三',
        userAuthStatus: 0,
        userAuthTime: '',
        userAuthContent: '',
        workorderStatus: 1,
        workorderStatusName: '处理中',
        handleContent: '',
        handleTime: '',
        level: 1,
        levelName: '紧急',
        initiatorPhone: '13800138000',
        initiatorName: '赵六',
        initiatorOpenid: '31249',
        noticeIds: '1,2,3',
        createTime: '2024-01-23 10:00:00',
      },
      {
        id: 2,
        workorderTypeId: 12436,
        workorderTypeName: '网络问题',
        workorderTitle: '网络连接不稳定',
        workorderContent: '会议室网络连接不稳定，经常断线，影响视频会议。',
        handlerId: 2,
        handlerName: '李四',
        userAuthStatus: 0,
        userAuthTime: '',
        userAuthContent: '',
        workorderStatus: 2,
        workorderStatusName: '已完成',
        handleContent: '已重启路由器，网络恢复正常',
        handleTime: '2024-01-22 15:30:00',
        level: 0,
        levelName: '普通',
        initiatorPhone: '13900139000',
        initiatorName: '钱七',
        initiatorOpenid: '31250',
        noticeIds: '2,3,4',
        createTime: '2024-01-22 09:15:00',
      },
      {
        id: 3,
        workorderTypeId: 12437,
        workorderTypeName: '系统报错',
        workorderTitle: 'CRM系统登录失败',
        workorderContent: 'CRM系统登录时提示账号或密码错误，但密码是正确的，请排查问题。',
        handlerId: 0,
        handlerName: '',
        userAuthStatus: 0,
        userAuthTime: '',
        userAuthContent: '',
        workorderStatus: 0,
        workorderStatusName: '待处理',
        handleContent: '',
        handleTime: '',
        level: 2,
        levelName: '加急',
        initiatorPhone: '13700137000',
        initiatorName: '孙八',
        initiatorOpenid: '31251',
        noticeIds: '1,3,5',
        createTime: '2024-01-23 08:45:00',
      },
    ];

    // 模拟筛选
    let filteredData = mockData;
    if (activeStatus.value !== -1) {
      filteredData = mockData.filter(item => item.workorderStatus === activeStatus.value);
    }

    workorders.value = filteredData;
    hasMore.value = false;
  } catch (error) {
    console.error('获取工单列表失败:', error);
    alert('获取工单列表失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

/**
 * 搜索工单
 */
const search = () => {
  // 实际项目中应该根据关键词搜索
  getWorkorderList();
};

/**
 * 按状态筛选
 */
const filterByStatus = (status: number) => {
  activeStatus.value = status;
  getWorkorderList();
};

/**
 * 加载更多
 */
const loadMore = () => {
  if (hasMore.value) {
    pagination.page++;
    getWorkorderList(true);
  }
};

/**
 * 跳转到工单详情页
 */
const goToDetail = (id: number) => {
  // 实际项目中应该跳转到详情页
  console.log('跳转到工单详情页:', id);
  alert(`查看工单详情：${id}`);
};

/**
 * 跳转到工单提交页
 */
const goToSubmit = () => {
  router.push('/workorder/submit');
};

/**
 * 获取状态名称
 */
const getStatusName = (status: number): string => {
  const statusMap: Record<number, string> = {
    0: '待处理',
    1: '处理中',
    2: '已完成',
    3: '已驳回',
  };
  return statusMap[status] || '未知';
};

/**
 * 获取等级名称
 */
const getLevelName = (level: number): string => {
  const levelMap: Record<number, string> = {
    0: '普通',
    1: '紧急',
    2: '加急',
  };
  return levelMap[level] || '未知';
};

/**
 * 获取内容摘要
 */
const getContentSummary = (content: string): string => {
  return content.length > 50 ? content.substring(0, 50) + '...' : content;
};

/**
 * 格式化时间
 */
const formatTime = (time: string): string => {
  return time;
};

/**
 * 组件挂载时获取工单列表
 */
onMounted(() => {
  getWorkorderList();
});
</script>