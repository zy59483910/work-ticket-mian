# 环境变量配置说明

## 环境变量文件

项目包含以下环境变量配置文件：

- `.env` - 基础环境变量（默认配置）
- `.env.dev` - 开发环境配置
- `.env.prod` - 生产环境配置
- `.env.example` - 环境变量示例文件

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|---------|
| `VITE_TENANT_ID` | 租户ID | 146 |
| `VITE_API_BASE_URL` | API基础路径 | /app-api |
| `VITE_REQUEST_TIMEOUT` | 请求超时时间（毫秒） | 10000 |

## 使用方法

### 1. 开发环境

```bash
npm run dev
```

使用 `.env.dev` 文件中的配置。

### 2. 生产环境构建

```bash
npm run build
```

使用 `.env.prod` 文件中的配置。

### 3. 开发环境构建

```bash
npm run build:dev
```

使用 `.env.dev` 文件中的配置进行构建。

### 4. 预览生产环境

```bash
npm run preview
```

### 5. 使用生产环境配置运行开发服务器

```bash
npm run dev:prod
```

## 配置文件优先级

Vite 会按以下优先级加载环境变量：

1. `.env.local` - 最高优先级（不应提交到版本控制）
2. `.env.[mode].local` - 特定模式的本地配置
3. `.env.[mode]` - 特定模式的配置（如 `.env.dev`、`.env.prod`）
4. `.env` - 基础配置

## 代码中使用

在代码中通过 `import.meta.env` 访问环境变量：

```typescript
// 获取租户ID
const tenantId = import.meta.env.VITE_TENANT_ID;

// 获取API基础路径
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 获取请求超时时间
const timeout = Number(import.meta.env.VITE_REQUEST_TIMEOUT);
```

## 注意事项

1. **变量命名规范**：Vite 环境变量必须以 `VITE_` 开头才能在客户端代码中访问
2. **类型安全**：已创建 `src/vite-env.d.ts` 文件提供 TypeScript 类型提示
3. **版本控制**：`.env`、`.env.dev`、`.env.prod` 已添加到 `.gitignore`，不会提交到版本控制
4. **首次配置**：复制 `.env.example` 为对应的配置文件，并根据实际情况修改
5. **重启生效**：修改环境变量后需要重启开发服务器或重新构建

## 示例配置

### 开发环境 (.env.dev)

```env
VITE_TENANT_ID=146
VITE_API_BASE_URL=/app-api
VITE_REQUEST_TIMEOUT=10000
```

### 生产环境 (.env.prod)

```env
VITE_TENANT_ID=146
VITE_API_BASE_URL=/app-api
VITE_REQUEST_TIMEOUT=10000
```

## 修改租户ID

如需修改租户ID，编辑对应的 `.env.dev` 或 `.env.prod` 文件：

```env
VITE_TENANT_ID=你的租户ID
```

修改后重启开发服务器：
```bash
npm run dev
```
