<template>
  <div class="workorder-info">
    <!-- 头部 -->
    <van-nav-bar
      title="工单详情"
      left-arrow
      @click-left="goBack"
      fixed
      :safe-area-inset-top="true"
      class="custom-navbar"
    />

    <!-- 内容区域 -->
    <div class="content">
      <!-- 工单基本信息卡片 -->
      <div class="info-card">
        <div class="card-title">工单信息</div>

        <!-- 工单标题 -->
        <div class="info-row">
          <span class="label">工单标题</span>
          <span class="value">{{ detail.workorderTitle || "-" }}</span>
        </div>

        <!-- 工单编号 -->
        <div class="info-row">
          <span class="label">工单编号</span>
          <span class="value">{{ detail.workorderNo || "-" }}</span>
        </div>

        <!-- 工单类型 -->
        <div class="info-row">
          <span class="label">工单类型</span>
          <span class="value">{{ detail.workorderType?.typeName || "-" }}</span>
        </div>

        <!-- 工单等级 -->
        <div class="info-row">
          <span class="label">工单等级</span>
          <span class="value">
            <span class="level" :class="getLevelClass(detail.level)">
            {{ getLevelText(detail.level) }}
          </span>
          </span>
          
        </div>

        <!-- 工单状态 -->
        <div class="info-row status-row">
          <span class="label">工单状态</span>
          <div class="value">
            <van-steps :active="getStatusStep(detail.workorderStatus)" direction="horizontal" active-color="#1989fa" inactive-color="#ddd">
              <van-step>待处理</van-step>
              <van-step>处理中</van-step>
              <van-step>处理完成</van-step>
              <van-step>已驳回</van-step>
              <van-step>已结束</van-step>
            </van-steps>
          </div>
        </div>

        <!-- 工单内容 -->
        <div class="info-content">
          <span class="label">工单内容</span>
          <div class="content-text" v-html="detail?.workorderContent" />
        </div>
      </div>

      <!-- 发起人信息卡片 -->
      <div class="info-card">
        <div class="card-title">发起人信息</div>

        <!-- 发起人姓名 -->
        <div class="info-row">
          <span class="label">发起人姓名</span>
          <span class="value">{{ detail.initiatorName || "-" }}</span>
        </div>

        <!-- 发起人电话 -->
        <div class="info-row">
          <span class="label">发起人电话</span>
          <span class="value">{{ detail.initiatorPhone || "-" }}</span>
        </div>

        <!-- 发起时间 -->
        <div class="info-row">
          <span class="label">发起时间</span>
          <span class="value">{{ formatDateTime(detail.createTime) }}</span>
        </div>
      </div>

      <!-- 处理人信息卡片 -->
      <div class="info-card" v-if="detail.handlerId">
        <div class="card-title">处理人信息</div>

        <!-- 处理人姓名 -->
        <div class="info-row">
          <span class="label">处理人姓名</span>
          <span class="value">{{ detail.handlerInfo?.nickname || "-" }}</span>
        </div>

        <!-- 处理人手机号 -->
        <div class="info-row">
          <span class="label">处理人手机号</span>
          <span class="value">{{ detail.handlerInfo?.mobile || "-" }}</span>
        </div>

        <!-- 处理内容 -->
        <div class="info-content">
          <span class="label">处理内容</span>
          <div class="content-text">{{ detail?.handleContent || "-" }}</div>
        </div>

        <!-- 处理时间 -->
        <div class="info-row">
          <span class="label">处理时间</span>
          <span class="value">{{ formatDateTime(detail.handleTime) }}</span>
        </div>
      </div>

      <!-- 状态变更操作卡片 -->
      <div class="info-card" v-if="canChangeStatus">
        <div class="card-title">状态变更</div>

        <!-- 状态选择 -->
        <div class="status-selector">
          <div
            v-for="status in statusOptions"
            :key="status.value"
            class="status-option"
            :class="{ active: selectedStatus === status.value }"
            @click="selectStatus(status.value)"
          >
            {{ status.label }}
          </div>
        </div>

        <!-- 确认按钮 -->
        <div class="action-btn">
          <van-button
            type="primary"
            size="large"
            round
            :loading="updating"
            @click="updateStatus"
          >
            确认变更
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { workorderApi } from "../api/workorder";
import type { WorkorderItem } from "../api/workorder";
import { Toast } from "vant";
import { formatDateTime } from "../utils/format";

// 路由实例
const route = useRoute();
const router = useRouter();

// 工单详情数据
const detail = ref({
  id: 0,
  workorderNo: "",
  workorderTypeId: 0,
  workorderTitle: "",
  workorderContent: "",
  handlerId: 0,
  workorderStatus: 0,
  handleContent: "",
  handleTime: "",
  level: 0,
  initiatorPhone: "",
  initiatorName: "",
  initiatorOpenid: "",
  createTime: "",
  handlerMobile: "",
  workorderType: {
    typeName: "",
  },
  handlerInfo: {
    nickname: "",
  },
});

// 加载状态
const loading = ref(false);
const updating = ref(false);

// 选中的状态
const selectedStatus = ref(0);

// 状态选项
const statusOptions = ref([
  { label: "处理中", value: 1 },
  { label: "处理完成", value: 2 },
  { label: "已驳回", value: 3 },
  { label: "已结束", value: 4 },
]);

/**
 * 判断是否可以更改状态
 */
const canChangeStatus = ref(false);

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
 * 获取状态步骤
 */
const getStatusStep = (status: number) => {
  const stepMap: Record<number, number> = {
    0: 0, // 待处理
    1: 1, // 处理中
    2: 2, // 处理完成
    3: 3, // 已驳回
    4: 4, // 已结束
  };
  return stepMap[status] ?? 0;
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
 * 选择状态
 */
const selectStatus = (status: number) => {
  selectedStatus.value = status;
};

/**
 * 更新状态
 */
const updateStatus = () => {
  // 暂时不调用接口，只更新本地状态
  updating.value = true;

  setTimeout(() => {
    detail.value.workorderStatus = selectedStatus.value;
    updating.value = false;

    Toast.success({
      message: "状态更新成功",
      duration: 2000,
      position: "top",
    });
  }, 500);
};

/**
 * 加载工单详情
 */
const loadDetail = async () => {
  const id = route.params.id as string;

  if (!id) {
    // Toast.fail({
    //   message: "工单ID不存在",
    //   duration: 2000,
    //   position: "top",
    // });
    return;
  }

  loading.value = true;

  try {
    const response = await workorderApi.getWorkorderDetail(Number(id));

    if (response) {
      detail.value = response;

      // 判断是否可以更改状态（待处理状态可以更改）
      canChangeStatus.value = detail.value.workorderStatus === 0;
    }
  } catch (error) {
    console.error("获取工单详情失败:", error);
    // Toast.fail({
    //   message: "获取工单详情失败",
    //   duration: 2000,
    //   position: "top",
    // });
  } finally {
    loading.value = false;
  }
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
  loadDetail();
});
</script>

<style scoped>
.workorder-info {
  background: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 2rem;
}

.content {
  margin: 4rem auto 0;
  width: 100%;
  padding: 1rem 1rem 0 1rem;
}

/* 信息卡片 */
.info-card {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #f0f0f0;
}

/* 信息行 */
.info-row {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.info-row.status-row {
  flex-direction: column;
  align-items: flex-start;
}

.label {
  color: #999;
  margin-right: 1rem;
  min-width: 6rem;
  font-weight: 500;
}

.value {
  color: #333;
  font-weight: 500;
  flex: 1;
  width: 100%;
}

/* 步骤条样式 */
:deep(.van-steps) {
  width: 100%;
  padding: 0.5rem 0;
}

:deep(.van-steps--horizontal) {
  padding: 0.5rem 0;
}

:deep(.van-step) {
  font-size: 0.75rem;
}

:deep(.van-step__title) {
  font-size: 0.75rem;
  font-weight: 500;
  color: #999;
}

:deep(.van-step--process .van-step__title) {
  color: #1989fa;
  font-weight: 600;
}

:deep(.van-step--finish .van-step__title) {
  color: #1989fa;
  font-weight: 600;
}

:deep(.van-step__circle-container) {
  padding: 0;
}

:deep(.van-step__circle) {
  width: 0.6rem;
  height: 0.6rem;
  background: #ddd;
  border: none;
}

:deep(.van-step--process .van-step__circle) {
  background: #1989fa;
}

:deep(.van-step--finish .van-step__circle) {
  background: #1989fa;
}

:deep(.van-step__line) {
  background: #ddd;
  height: 2px;
}

:deep(.van-step--process .van-step__line) {
  background: #1989fa;
}

:deep(.van-step--finish .van-step__line) {
  background: #1989fa;
}

/* 信息内容 */
.info-content {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-content > .label {
  display: block;
  margin-bottom: 0.5rem;
}

.content-text {
  color: #666;
  line-height: 1.8;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 0.8rem;
  font-size: 1.2rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  max-width: 100%;
  overflow: hidden;
}

/* 状态选择器 */
.status-selector {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.status-option {
  flex: 1;
  min-width: calc(50% - 0.4rem);
  padding: 0.9rem 1.2rem;
  background: #ffffff;
  border-radius: 1rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.status-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(25, 137, 250, 0.05) 0%, rgba(12, 124, 213, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 0.8rem;
}

.status-option:active {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  transform: scale(0.96);
}

.status-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08);
}

.status-option:hover::before {
  opacity: 1;
}

.status-option.active {
  background: linear-gradient(135deg, #1989fa 0%, #0c7cd5 100%);
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(25, 137, 250, 0.35), 0 2px 6px rgba(25, 137, 250, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.status-option.active::before {
  opacity: 0;
}

/* 操作按钮 */
.action-btn {
  margin-top: 1rem;
}

.action-btn > button {
  width: 100%;
  height: 3.5rem;
  border-radius: 1.2rem;
  background: linear-gradient(135deg, #1989fa 0%, #0c7cd5 100%);
  box-shadow: 0 4px 15px rgba(25, 137, 250, 0.3);
  border: none;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.action-btn > button:active {
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.4);
  transform: translateY(2px);
}

/* 等级样式 */
.level {
  padding: 0.2rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 1.05rem;
  font-weight: 600;
  display: inline-block;
  white-space: nowrap;
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

/* 防止iOS双击缩放 */
* {
  touch-action: manipulation;
}
</style>
