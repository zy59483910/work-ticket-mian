import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import WorkorderSubmit from '../components/WorkorderSubmit.vue';
import WorkorderList from '../components/WorkorderList.vue';
import WorkorderInfo from '../components/WorkorderInfo.vue';

/**
 * 路由配置
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/workorder/submit'
  },
  {
    path: '/workorder/list',
    name: 'WorkorderList',
    component: WorkorderList,
    meta: {
      title: '工单列表'
    }
  },
  {
    path: '/workorder/submit',
    name: 'WorkorderSubmit',
    component: WorkorderSubmit,
    meta: {
      title: '发起工单'
    }
  },
  {
    path: '/workorder/detail/:id',
    name: 'WorkorderDetail',
    component: WorkorderInfo,
    meta: {
      title: '工单详情'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/workorder/list'
  }
];

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(),
  routes
});

/**
 * 路由前置守卫
 */
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = to.meta.title as string || '工单系统';
  next();
});

export default router;