<template>
  <div class="workorder-submit">
    <!-- 头部 - 使用vant的NavBar组件 -->
    <!-- <van-nav-bar title="发起工单" left-text="" fixed :safe-area-inset-top="true" class="custom-navbar" /> -->

    <!-- 内容区域 -->
    <div class="content">
      <!-- 表单卡片 -->
      <div class="form-card">
        <!-- 工单类型 -->
        <van-field
          v-model="typeDisplayText"
          name="workorderTypeId"
          is-link
          readonly
          clickable
          @click="showTypePicker = true"
          placeholder="请选择工单类型"
          :error-message="errors.workorderTypeId"
        >
          <template #label>
            <span class="required-label">工单类型</span>
          </template>
        </van-field>

        <!-- 工单标题 -->
        <van-field
          v-model="form.workorderTitle"
          name="workorderTitle"
          placeholder="请输入工单标题"
          :error-message="errors.workorderTitle"
        >
          <template #label>
            <span class="required-label">工单标题</span>
          </template>
        </van-field>

        <!-- 工单内容 -->
        <van-field
          v-model="form.workorderContent"
          name="workorderContent"
          type="textarea"
          placeholder="请输入工单内容"
          :rows="4"
          :error-message="errors.workorderContent"
        >
          <template #label>
            <span class="required-label">工单内容</span>
          </template>
        </van-field>

        <!-- 发起人姓名 -->
        <van-field
          v-model="form.initiatorName"
          label-width="10rem"
          name="initiatorName"
          placeholder="请输入发起人姓名"
          :error-message="errors.initiatorName"
        >
          <template #label>
            <span class="required-label">发起人姓名</span>
          </template>
        </van-field>

        <!-- 发起人电话 -->
        <van-field
          v-model="form.initiatorPhone"
          name="initiatorPhone"
          label-width="10rem"
          placeholder="请输入发起人电话"
          type="tel"
          :error-message="errors.initiatorPhone"
        >
          <template #label>
            <span class="required-label">发起人电话</span>
          </template>
        </van-field>

        <!-- 工单等级 -->
        <van-field name="level">
          <template #label>
            <span class="optional-label">工单等级</span>
          </template>
          <template #input>
            <div class="level-selector">
              <van-button
                v-for="level in levelOptions"
                :key="level.value"
                :type="form.level === level.value ? 'primary' : 'default'"
                @click="form.level = level.value"
                size="large"
              >
                {{ level.label }}
              </van-button>
            </div>
          </template>
        </van-field>

        <!-- 通知人员 -->
        <van-field
          v-model="noticeDisplayText"
          name="noticeIds"
          is-link
          readonly
          clickable
          @click="showNoticePicker = true"
          placeholder="请选择通知人员"
          :error-message="errors.noticeIds"
        >
          <template #label>
            <span class="required-label">通知人员</span>
          </template>
        </van-field>
        <!-- 工单类型选择器 -->
        <van-action-sheet
          v-model:show="showTypePicker"
          title="选择工单类型"
          :actions="workorderTypes"
          @select="onSelectType"
        />

        <!-- 通知人员选择器 -->
        <van-popup
          v-model:show="showNoticePicker"
          position="bottom"
          round
          :style="{ height: '60%' }"
        >
          <div class="notice-picker">
            <div class="notice-picker-header">
              <van-button type="default" @click="onCancelNotice">取消</van-button>
              <div class="notice-picker-title">选择通知人员</div>
              <van-button type="primary" @click="onConfirmNotice">确认</van-button>
            </div>
            <div class="notice-picker-content">
              <van-checkbox-group v-model="selectedNotices">
                <van-cell-group>
                  <van-cell
                    v-for="notice in noticeList"
                    :key="notice.id"
                    clickable
                    @click="onToggleNotice(notice)"
                  >
                    <template #title>
                      <div class="notice-item">
                        <van-checkbox
                          :name="notice"
                          :checked="selectedNotices.some((item) => item.id === notice.id)"
                          @click.stop
                        >
                          {{ notice.title }}
                        </van-checkbox>
                      </div>
                    </template>
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
            </div>
          </div>
        </van-popup>
      </div>

      <!-- 底部按钮 -->
      <div class="bottom-btn">
        <van-button @click="resetForm">重置</van-button>
        <van-button type="primary" @click="submitForm">提交</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { workorderApi } from "../api/workorder";
import type { MainSaveReqVO } from "../api/workorder";
import { showToast, showSuccessToast, showFailToast, showLoadingToast } from 'vant'

// 获取组件实例
const instance = getCurrentInstance();

// 路由实例
const router = useRouter();

// 显示工单类型选择器
const showTypePicker = ref(false);
// 显示通知人员选择器
const showNoticePicker = ref(false);
// 工单类型显示文本
const typeDisplayText = ref("");

// 工单类型列表 - 调整为vant ActionSheet需要的格式
const workorderTypes = ref<Array<{ id: number; name: string; value: number }>>([
  { id: 12435, name: "设备故障", value: 12435 },
  { id: 12436, name: "网络问题", value: 12436 },
  { id: 12437, name: "系统报错", value: 12437 },
  { id: 12438, name: "业务咨询", value: 12438 },
  { id: 12439, name: "其他问题", value: 12439 },
]);

// 通知人员列表 - 模拟数据
const noticeList = ref<Array<{ id: string; title: string }>>([
  { id: '1', title: "张三" },
  { id: '2', title: "李四" },
  { id: '3', title: "王五" },
  { id: '4', title: "赵六" },
  { id: '5', title: "钱七" },
  { id: '6', title: "孙八" },
  { id: '7', title: "周九" },
  { id: '8', title: "吴十" },
]);

// 选中的通知人员
const selectedNotices = ref<Array<{ id: number; title: string }>>([]);
// 通知人员显示文本
const noticeDisplayText = ref("");

// 工单等级选项
const levelOptions = [
  { label: "普通", value: 0 },
  { label: "紧急", value: 1 },
  { label: "加急", value: 2 },
];

// 表单数据
const form = reactive<MainSaveReqVO & { noticeIdsArray?: number[] }>({
  workorderTypeId: 0,
  workorderTitle: "",
  workorderContent: "",
  handlerId: 0,
  workorderStatus: 1, // 初始状态为处理中
  level: 0,
  initiatorPhone: "",
  initiatorName: "",
  initiatorOpenid: "31249", // 模拟openid
  noticeIds: "",
  noticeIdsArray: [], // 通知人员数组
});

// 表单错误信息
const errors = reactive({
  workorderTypeId: "",
  workorderTitle: "",
  workorderContent: "",
  initiatorName: "",
  initiatorPhone: "",
  level: "",
  noticeIds: "",
});

/**
 * 选择工单类型
 */
const onSelectType = (action: any) => {
  form.workorderTypeId = action.value;
  typeDisplayText.value = action.name;
  showTypePicker.value = false;
};

/**
 * 切换通知人员选择
 */
const onToggleNotice = (notice: { id: number; title: string }) => {
  const index = selectedNotices.value.findIndex((item) => item.id === notice.id);
  if (index > -1) {
    // 已选中，取消选中
    selectedNotices.value.splice(index, 1);
  } else {
    // 未选中，添加选中
    selectedNotices.value.push(notice);
  }
};

/**
 * 确认选择通知人员
 */
const onConfirmNotice = () => {
  // 将选中的通知人员ID数组直接存储
  form.noticeIdsArray = selectedNotices.value.map((item) => item.id);
  // 将选中的通知人员名称显示在输入框中
  noticeDisplayText.value = selectedNotices.value.map((item) => item.title).join("、");
  showNoticePicker.value = false;
};

/**
 * 取消选择通知人员
 */
const onCancelNotice = () => {
  showNoticePicker.value = false;
};

/**
 * 表单验证
 */
const validateForm = (): boolean => {
  let isValid = true;

  // 重置错误信息
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  // 验证工单类型
  if (!form.workorderTypeId) {
    errors.workorderTypeId = "请选择工单类型";
    isValid = false;
  }

  // 验证工单标题
  if (!form.workorderTitle.trim()) {
    errors.workorderTitle = "请输入工单标题";
    isValid = false;
  }

  // 验证工单内容
  if (!form.workorderContent.trim()) {
    errors.workorderContent = "请输入工单内容";
    isValid = false;
  }

  // 验证发起人姓名
  if (!form.initiatorName.trim()) {
    errors.initiatorName = "请输入发起人姓名";
    isValid = false;
  }

  // 验证发起人电话
  if (!form.initiatorPhone.trim()) {
    errors.initiatorPhone = "请输入发起人电话";
    isValid = false;
  } else if (!/^1[3-9]\d{9}$/.test(form.initiatorPhone)) {
    errors.initiatorPhone = "请输入正确的手机号码";
    isValid = false;
  }

  // 验证通知人员
  if (!form.noticeIdsArray || form.noticeIdsArray.length === 0) {
    errors.noticeIds = "请选择通知人员";
    isValid = false;
  }

  return isValid;
};

/**
 * 提交表单
 */
const submitForm = async () => {
  // showSuccessToast('确认提交工单吗？')
  
  // showConfirmDialog({
  //   title: '确认提交工单吗？',
  // }).then(() => {}).catch(() => {})

  // 表单验证
  if (!validateForm()) {
    return;
  }
  const toastLoding = showLoadingToast({
    message: '工单创建中',
    duration: 0, // 持续显示
    forbidClick: true
  });
  
  try {
    // 将通知人员数组转换为逗号分隔的字符串（如果API需要字符串格式）
    const submitData = {
      ...form,
      noticeIds: form.noticeIdsArray
    };

    // 调用API提交工单
    await workorderApi.createWorkorder(submitData);
    showSuccessToast('工单提交成功！')
    // 跳转到工单列表页
    // setTimeout(() => {
    //   router.push("/workorder/list");
    // }, 2000);
  } catch (error) {
    // showToast({
    //   type: 'fail',
    //   message: '工单提交失败！',
    //   duration: 5000
    // })
    showFailToast('工单提交失败！')
    console.error("提交工单失败:", error);
  } finally {
    // 关闭加载提示
    // toastLoding.close()
  }
};

/**
 * 重置表单
 */
const resetForm = () => {
  form.workorderTypeId = 0;
  typeDisplayText.value = "";
  form.workorderTitle = "";
  form.workorderContent = "";
  form.handlerId = 0;
  form.workorderStatus = 1;
  form.level = 0;
  form.initiatorPhone = "";
  form.initiatorName = "";
  form.initiatorOpenid = "31249";
  form.noticeIds = "";
  form.noticeIdsArray = [];
  noticeDisplayText.value = "";
  selectedNotices.value = [];

  // 重置错误信息
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });
};

/**
 * 返回上一页
 */
const goBack = () => {
  router.back();
};

/**
 * 组件挂载时获取工单类型列表
 */
onMounted(async () => {
  try {
    // 实际项目中应该调用API获取工单类型
    const types = await workorderApi.getWorkorderTypes();
    console.log(types,123213 )
    // workorderTypes.value = types.map(type => ({ ...type, value: type.id }));
  } catch (error) {
    console.error("获取工单类型失败:", error);
  }
});
</script>
<style scoped>
.workorder-submit {
  background: #ffffff;
  min-height: 100vh;
  padding-bottom: 2rem;
}
.form-card {
  /* border-radius: 1.5rem !important; */
  background: #ffffff;
  padding: 2rem 1.5rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05); */
}
.content {
  /* width: 92%;
  border-radius: 2rem;
  background: #f8f9fa;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  padding: 1.5rem; */
}
.level-selector {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
}
.level-selector > button {
  flex: 1;
  height: 3.2rem;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.08), inset -3px -3px 6px rgba(0, 0, 0, 0.04);
  border: none;
  color: #666;
  font-weight: 600;
  transition: all 0.3s ease;
}
.level-selector > button:active {
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(0, 0, 0, 0.05);
  transform: scale(0.98);
}
.level-selector > button.van-button--primary {
  background: #ffffff;
  color: #1989fa;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.15);
}
.level-selector > button.van-button--primary:active {
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
  transform: scale(0.98);
}
.bottom-btn {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 1rem 1rem;
}
.bottom-btn > button {
  flex: 1;
  max-width: 45%;
  height: 4rem;
  border-radius: 1.2rem;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  border: none;
  color: #666;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.bottom-btn > button:active {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transform: translateY(2px);
}
.bottom-btn > button.van-button--primary {
  background: linear-gradient(135deg, #1989fa 0%, #0c7cd5 100%);
  box-shadow: 0 4px 15px rgba(25, 137, 250, 0.3);
  color: #ffffff;
}
.bottom-btn > button.van-button--primary:active {
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.4);
}

/* 覆盖 Vant 组件样式以符合高级拟态风格 */
:deep(.custom-navbar) {
  background: #ffffff !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
  height: 4rem !important;
  padding: 0 1rem !important;
}

:deep(.van-nav-bar) {
  background: #ffffff !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
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

:deep(.van-field) {
  background: #ffffff !important;
  border-radius: 1rem !important;
  margin-bottom: 1.8rem !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04) !important;
  border: none !important;
  padding: 1rem !important;
}

:deep(.van-field__label) {
  color: #333 !important;
  font-weight: 600 !important;
  font-size: 1.2rem !important;
}

:deep(.van-field__control) {
  color: #333 !important;
  background: transparent !important;
  font-size: 1.2rem !important;
}

:deep(.van-field__control::placeholder) {
  color: #999 !important;
}

:deep(.van-action-sheet) {
  background: #f8f9fa !important;
  border-radius: 1.5rem 1.5rem 0 0 !important;
}

:deep(.van-action-sheet__header) {
  background: #ffffff !important;
  color: #333 !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  border-bottom: 1px solid #f0f0f0 !important;
}

:deep(.van-action-sheet__item) {
  background: #ffffff !important;
  color: #333 !important;
  border-radius: 1rem !important;
  margin: 0.5rem 1rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04) !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  width: 95% !important;
}

:deep(.van-action-sheet__item:active) {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(1px) !important;
}

:deep(.van-action-sheet__cancel) {
  background: #ffffff !important;
  color: #666 !important;
  font-weight: 500 !important;
}

:deep(.van-action-sheet__content) {
  background: #f8f9fa !important;
  padding: 1rem 0 !important;
}

/* 必填字段标签样式 */
.required-label {
  color: #333;
  font-weight: 600;
  font-size: 1.4rem;
}

.required-label::before {
  content: "*";
  color: #ff4d4f;
  margin-right: 0.2rem;
  font-weight: 600;
}

/* 可选字段标签样式 */
.optional-label {
  color: #333;
  font-weight: 600;
  font-size: 1.4rem;
}

/* 防止iOS自动缩放 */
@supports (-webkit-touch-callout: none) {
  :deep(.van-field__control) {
    font-size: 16px !important;
  }
}

/* 错误提示样式 */
:deep(.van-field__error-message) {
  color: #ff4d4f !important;
  font-size: 0.85rem !important;
  margin-top: 0.3rem !important;
  font-weight: 500 !important;
}

:deep(.van-field--error) {
  border-color: #ff4d4f !important;
}

:deep(.van-field--error .van-field__control) {
  color: #ff4d4f !important;
}

/* 通知人员选择器样式 */
.notice-picker {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.notice-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}

.notice-picker-header > button {
  padding: 0.5rem 1rem;
  border-radius: 0.8rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.notice-picker-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.notice-picker-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.notice-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
}

:deep(.van-cell) {
  background: #ffffff !important;
  border-radius: 1rem !important;
  margin-bottom: 0.5rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04) !important;
  padding: 1rem !important;
}

:deep(.van-cell:active) {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08) !important;
  transform: scale(0.99) !important;
}

:deep(.van-checkbox) {
  font-size: 1rem;
  font-weight: 500;
}

:deep(.van-checkbox__icon) {
  font-size: 1.2rem;
}

:deep(.van-checkbox__label) {
  color: #333;
  font-weight: 500;
}

:deep(.van-popup) {
  background: #f8f9fa !important;
}
</style>