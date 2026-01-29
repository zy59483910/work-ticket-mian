<template>
  <div class="maintainer-bind">
    <!-- 头部 -->
    <div class="header">
      <van-icon
        size="1.8rem"
        class="back-icon"
      />
      <div class="header-title">系统维护人员绑定</div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 查询卡片 -->
      <div class="query-card">
        <div class="card-title">查询维护人员</div>
        <van-field
          v-model="phone"
          type="tel"
          placeholder="请输入手机号"
          maxlength="11"
          class="phone-input"
        >
          <template #button>
            <van-button
              type="primary"
              size="small"
              @click="queryHandler"
              :loading="querying"
              loading-text="查询中"
              class="query-btn"
            >
              查询
            </van-button>
          </template>
        </van-field>
      </div>

      <!-- 用户信息卡片 -->
      <div v-if="userInfo" class="user-info-card">
        <div class="card-title">用户信息</div>
        <div class="info-row">
          <div class="info-label">用户ID</div>
          <div class="info-value">{{ userInfo.id }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">昵称</div>
          <div class="info-value">{{ userInfo.nickname }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">手机号</div>
          <div class="info-value">{{ userInfo.mobile }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">账号状态</div>
          <div
            class="info-value status"
            :class="{ active: userInfo.status === 0 }"
          >
            {{ userInfo.status === 0 ? "正常" : "禁用" }}
          </div>
        </div>
        <div class="info-row">
          <div class="info-label">部门编号</div>
          <div class="info-value">{{ userInfo.deptId }}</div>
        </div>

        <!-- 绑定按钮 -->
        <van-button
          type="primary"
          block
          @click="bindHandler"
          :loading="binding"
          loading-text="绑定中"
          class="bind-btn"
        >
          确认绑定
        </van-button>
      </div>

      <!-- 提示信息 -->
      <div v-if="!userInfo" class="tips-card">
        <div class="tips-icon">💡</div>
        <div class="tips-text">请输入手机号查询对应的系统维护人员信息</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { workorderApi } from "../api/workorder";

const router = useRouter();

const phone = ref("");
const userInfo = ref<any>(null);
const querying = ref(false);
const binding = ref(false);

const goBack = () => {
  router.back();
};

const queryHandler = async () => {
  if (!phone.value) {
    showToast({
      message: "请输入手机号",
      position: "top",
    });
    return;
  }

  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone.value)) {
    showToast({
      message: "请输入正确的手机号",
      position: "top",
    });
    return;
  }

  querying.value = true;
  try {
    const response = await workorderApi.getHandlerByPhone(phone.value);
    if (response) {
      userInfo.value = response;
      showToast({
        message: "查询成功",
        position: "top",
      });
    } else {
      showToast({
        message: "未找到对应的用户信息",
        position: "top",
      });
      userInfo.value = null;
    }
  } catch (error) {
    console.error("查询用户失败:", error);
    showToast({
      message: "查询失败，请稍后重试",
      position: "top",
    });
    userInfo.value = null;
  } finally {
    querying.value = false;
  }
};

const bindHandler = async () => {
  if (!userInfo.value) {
    showToast({
      message: "请先查询用户信息",
      position: "top",
    });
    return;
  }

  const openid = localStorage.getItem("wechat_openid");
  if (!openid) {
    showToast({
      message: "未获取到微信授权信息，请重新授权",
      position: "top",
    });
    return;
  }

  binding.value = true;
  try {
    const data = {
      adminId: userInfo.value.id,
      openid: openid,
    };
    const response = await workorderApi.bindHandler(data);
    if (response && response.code === 0) {
      showToast({
        message: "绑定成功",
        position: "top",
      });
      setTimeout(() => {
        router.back();
      }, 1500);
    } else {
      showToast({
        message: response?.msg || "绑定失败",
        position: "top",
      });
    }
  } catch (error) {
    console.error("绑定失败:", error);
    showToast({
      message: "绑定失败，请稍后重试",
      position: "top",
    });
  } finally {
    binding.value = false;
  }
};
</script>

<style scoped lang="scss">
.maintainer-bind {
  min-height: 100vh;
  background: linear-gradient(145deg, #f0f2f5, #e8eaed);
  padding: 2rem 1.5rem;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
}

.back-icon {
  color: #333;
  cursor: pointer;
  z-index: 1;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.query-card,
.user-info-card,
.tips-card {
  background: #f8f9fa;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 8px 8px 16px #d1d3d6, -8px -8px 16px #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.2rem;
  padding-left: 0.5rem;
  border-left: 4px solid #1989fa;
}

.phone-input {
  background: #f8f9fa;
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: inset 4px 4px 8px #d1d3d6, inset -4px -4px 8px #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

:deep(.phone-input .van-field__control) {
  background: transparent;
  color: #333;
  font-size: 1.1rem;
}

:deep(.phone-input .van-field__control::placeholder) {
  color: #999;
}

.query-btn {
  background: linear-gradient(135deg, #1989fa, #0c7cd5);
  border: none;
  border-radius: 0.8rem;
  font-weight: 600;
  box-shadow: 4px 4px 8px rgba(25, 137, 250, 0.3);
  transition: all 0.3s ease;
}

.query-btn:active {
  box-shadow: 2px 2px 4px rgba(25, 137, 250, 0.3);
  transform: translateY(1px);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.info-row:last-of-type {
  border-bottom: none;
}

.info-label {
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
  text-align: right;
  max-width: 60%;
  word-break: break-all;
}

.info-value.status {
  padding: 0.3rem 1rem;
  border-radius: 0.8rem;
  font-size: 1rem;
}

.info-value.status.active {
  background: linear-gradient(135deg, #52c41a, #389e0d);
  color: #fff;
  box-shadow: 2px 2px 4px rgba(82, 196, 26, 0.3);
}

.info-value.status:not(.active) {
  background: linear-gradient(135deg, #ff4d4f, #cf1322);
  color: #fff;
  box-shadow: 2px 2px 4px rgba(255, 77, 79, 0.3);
}

.bind-btn {
  margin-top: 1.5rem;
  background: linear-gradient(135deg, #1989fa, #0c7cd5);
  border: none;
  border-radius: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  height: 4.4rem;
  box-shadow: 6px 6px 12px rgba(25, 137, 250, 0.3);
  transition: all 0.3s ease;
}

.bind-btn:active {
  box-shadow: 3px 3px 6px rgba(25, 137, 250, 0.3);
  transform: translateY(2px);
}

.tips-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1.5rem;
}

.tips-icon {
  font-size: 2.5rem;
}

.tips-text {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
}

/* 防止iOS自动缩放 */
@supports (-webkit-touch-callout: none) {
  :deep(.van-field__control) {
    font-size: 16px !important;
  }
}
</style>
