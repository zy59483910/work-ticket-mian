<template>
  <div class="workorder-list">
    <!-- 头部 -->
    <van-nav-bar
      title="工单列表"
      left-arrow
      @click-left="goBack"
      fixed
      :safe-area-inset-top="true"
      class="custom-navbar"
    />

    <!-- 内容区域 -->
    <div class="content">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <van-search
          v-model="searchKeyword"
          placeholder="搜索工单标题"
          @search="onSearch"
          @clear="onClear"
        />
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <van-dropdown-menu>
          <van-dropdown-item
            v-model="filterStatus"
            :options="statusOptions"
            @change="onFilterChange"
          />
          <van-dropdown-item
            v-model="filterType"
            :options="typeOptions"
            @change="onFilterChange"
          />
        </van-dropdown-menu>
      </div>

      <!-- 工单列表 -->
      <div class="list-container">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div
              v-for="item in list"
              :key="item.id"
              class="workorder-item"
              @click="goToDetail(item.id)"
            >
              <!-- 工单头部 -->
              <div class="item-header">
                <div class="item-title">{{ item.workorderTitle }}</div>
                <div
                  class="item-status"
                  :class="getStatusClass(item.workorderStatus)"
                >
                  {{ getStatusText(item.workorderStatus) }}
                </div>
              </div>

              <!-- 工单内容 -->
              <!-- <div class="item-content">{{ item.workorderContent }}</div> -->

              <!-- 工单信息 -->
              <div class="item-info">
                <div class="info-row">
                  <span class="info-label">工单类型：</span>
                  <span class="info-value">{{
                    item.workorderType?.typeName || "-"
                  }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">工单等级：</span>
                  <span
                    class="info-value level"
                    :class="getLevelClass(item.level)"
                  >
                    {{ getLevelText(item.level) }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">发起人：</span>
                  <span class="info-value">{{
                    item.initiatorName || "-"
                  }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">发起时间：</span>
                  <span class="info-value">{{ item.createTime || "-" }}</span>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>

        <!-- 空状态 -->
        <van-empty
          v-if="list.length === 0 && !loading"
          description="暂无工单"
          image="search"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { workorderApi } from "../api/workorder";
import type { WorkorderItem } from "../api/workorder";
import { Toast } from "vant";

// 路由实例
const router = useRouter();

// 搜索关键词
const searchKeyword = ref("");

// 筛选状态
const filterStatus = ref(null);
const filterType = ref(null);

// 列表数据
const list = ref<WorkorderItem[]>([]);

// 分页参数
const pageNo = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 加载状态
const loading = ref(false);
const refreshing = ref(false);
const finished = ref(false);

// 状态选项
const statusOptions = ref([
  { text: "全部状态", value: null },
  { text: "待处理", value: "0" },
  { text: "处理中", value: "1" },
  { text: "处理完成", value: "2" },
  { text: "已驳回", value: "3" },
  { text: "已结束", value: "4" },
]);

// 类型选项
const typeOptions = ref([
  { text: "全部等级", value: null },
  { text: "普通", value: '0' },
  { text: "紧急", value: '1' },
  { text: "加急", value: '2' },
]);

/**
 * 获取状态文本
 */
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: "待处理",
    1: "处理中",
    2: "处理完成",
    3: "已驳回",
    4: "已结束",
  };
  return statusMap[status] || "未知";
};

/**
 * 获取状态样式类
 */
const getStatusClass = (status: number) => {
  const classMap: Record<number, string> = {
    0: "status-pending",
    1: "status-processing",
    2: "status-completed",
    3: "status-rejected",
    4: "status-ended",
  };
  return classMap[status] || "";
};

/**
 * 获取等级文本
 */
const getLevelText = (level: number) => {
  const levelMap: Record<number, string> = {
    0: "普通",
    1: "紧急",
    2: "加急",
  };
  return levelMap[level] || "普通";
};

/**
 * 获取等级样式类
 */
const getLevelClass = (level: number) => {
  const classMap: Record<number, string> = {
    0: "level-normal",
    1: "level-urgent",
    2: "level-emergency",
  };
  return classMap[level] || "level-normal";
};

/**
 * 加载工单列表
 */
const loadWorkorderList = async (isRefresh = false) => {
  if (isRefresh) {
    pageNo.value = 1;
    list.value = [];
    finished.value = false;
  }

  if (finished.value) {
    return;
  }

  loading.value = true;

  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      workorderTitle: searchKeyword.value || undefined,
      workorderStatus: filterStatus.value || undefined,
      level: filterType.value || undefined,
      initiatorOpenid: "31249",
    };

    const response = await workorderApi.getWorkorderList(params);
    console.log(response);
    if (response && response.list && response.list.length > 0) {
      if (isRefresh || pageNo.value === 1) {
        list.value = response.list;
      } else {
        list.value = [...list.value, ...response.list];
      }

      total.value = response.total || 0;

      if (list.value.length >= total.value) {
        finished.value = true;
      } else {
        pageNo.value++;
      }
    } else {
      finished.value = true;
    }
  } catch (error) {
    console.error("获取工单列表失败:", error);
    Toast.fail({
      message: "获取工单列表失败",
      duration: 2000,
      position: "top",
    });
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

/**
 * 下拉刷新
 */
const onRefresh = () => {
  refreshing.value = true;
  loadWorkorderList(true);
};

/**
 * 上拉加载
 */
const onLoad = () => {
  loadWorkorderList(false);
};

/**
 * 搜索
 */
const onSearch = () => {
  pageNo.value = 1;
  list.value = [];
  finished.value = false;
  loadWorkorderList(true);
};

/**
 * 清除搜索
 */
const onClear = () => {
  searchKeyword.value = "";
  onSearch();
};

/**
 * 筛选变化
 */
const onFilterChange = () => {
  pageNo.value = 1;
  list.value = [];
  finished.value = false;
  loadWorkorderList(true);
};

/**
 * 跳转到详情页
 */
const goToDetail = (id: number) => {
  router.push(`/workorder/detail/${id}`);
};

/**
 * 返回上一页
 */
const goBack = () => {
  router.back();
};

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  loadWorkorderList(true);
});
</script>

<style scoped>
.workorder-list {
  background: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 2rem;
}

.content {
  margin: 4rem auto 0;
  width: 100%;
  padding: 0 1rem;
}

/* 搜索栏 */
.search-bar {
  padding-top: 1rem;
  margin-bottom: 1rem;
}

:deep(.van-search) {
  background: #ffffff !important;
  border-radius: 1rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04) !important;
  padding: 0.5rem 1rem !important;
}

:deep(.van-search__content) {
  background: #ffffff !important;
}

/* 筛选栏 */
.filter-bar {
  margin-bottom: 1rem;
}

:deep(.van-dropdown-menu) {
  background: #ffffff !important;
  border-radius: 1rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04) !important;
}

:deep(.van-dropdown-menu__item) {
  background: #ffffff !important;
  color: #333 !important;
  font-weight: 500 !important;
}

/* 列表容器 */
.list-container {
  background: #f8f9fa;
  border-radius: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  min-height: calc(100vh - 12rem);
}

/* 工单项 */
.workorder-item {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 1.2rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.workorder-item:active {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transform: scale(0.99);
}

/* 工单头部 */
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
}

.item-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 1rem;
}

.item-status {
  padding: 0.3rem 0.8rem;
  border-radius: 0.6rem;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-pending {
  background: #fff7e6;
  color: #faad14;
}

.status-processing {
  background: #e6f7ff;
  color: #1989fa;
}

.status-completed {
  background: #f0f9eb;
  color: #07c160;
}

.status-rejected {
  background: #fef0f0;
  color: #ee0a24;
}

/* 工单内容 */
.item-content {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 工单信息 */
.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
}

.info-label {
  color: #999;
  margin-right: 0.5rem;
  min-width: 5rem;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.level {
  padding: 0.2rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.level-normal {
  background: #f0f9eb;
  color: #07c160;
}

.level-urgent {
  background: #fff7e6;
  color: #faad14;
}

.level-emergency {
  background: #fef0f0;
  color: #ee0a24;
}

/* 导航栏 */
:deep(.custom-navbar) {
  background: #ffffff !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
  height: 4rem !important;
  padding: 0 1rem !important;
}

:deep(.van-nav-bar__title) {
  color: #333 !important;
  font-weight: 600 !important;
  font-size: 1.1rem !important;
}

:deep(.van-icon-arrow-left) {
  color: #666 !important;
  font-size: 1.2rem !important;
  padding: 0.5rem !important;
  border-radius: 50% !important;
  transition: all 0.3s ease !important;
}

:deep(.van-icon-arrow-left:active) {
  background: #f8f9fa !important;
  transform: scale(0.95) !important;
}

/* 空状态 */
:deep(.van-empty) {
  background: transparent !important;
}

:deep(.van-empty__description) {
  color: #999 !important;
  font-size: 0.95rem !important;
}

/* 防止iOS双击缩放 */
* {
  touch-action: manipulation;
}
</style>
