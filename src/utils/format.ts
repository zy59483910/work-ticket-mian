/**
 * 格式化日期时间
 * @param timestamp 时间戳（秒或毫秒）
 * @param format 格式字符串，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(timestamp: number | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!timestamp) {
    return '-';
  }

  // 转换为数字
  let ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;

  // 如果是秒级时间戳，转换为毫秒级
  if (ts < 10000000000) {
    ts = ts * 1000;
  }

  const date = new Date(ts);

  if (isNaN(date.getTime())) {
    return '-';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化日期
 * @param timestamp 时间戳（秒或毫秒）
 * @returns 格式化后的日期字符串，格式：YYYY-MM-DD
 */
export function formatDate(timestamp: number | string): string {
  return formatDateTime(timestamp, 'YYYY-MM-DD');
}

/**
 * 格式化时间
 * @param timestamp 时间戳（秒或毫秒）
 * @returns 格式化后的时间字符串，格式：HH:mm:ss
 */
export function formatTime(timestamp: number | string): string {
  return formatDateTime(timestamp, 'HH:mm:ss');
}

/**
 * 格式化相对时间
 * @param timestamp 时间戳（秒或毫秒）
 * @returns 相对时间字符串，如：刚刚、5分钟前、2小时前、3天前等
 */
export function formatRelativeTime(timestamp: number | string): string {
  if (!timestamp) {
    return '-';
  }

  let ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;

  if (ts < 10000000000) {
    ts = ts * 1000;
  }

  const date = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 30) {
    return `${days}天前`;
  } else if (months < 12) {
    return `${months}个月前`;
  } else {
    return `${years}年前`;
  }
}

/**
 * 获取当前时间戳（毫秒）
 * @returns 当前时间戳
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * 获取当前时间戳（秒）
 * @returns 当前时间戳（秒）
 */
export function getCurrentTimestampSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
