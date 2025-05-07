export const getFileSize = (limit: number) => {
  let size = '';
  if (limit < 0.1 * 1024) {
    size = limit.toFixed(2) + 'B';
  } else if (limit < 0.1 * 1024 * 1024) {
    size = (limit / 1024).toFixed(2) + 'KB';
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }
  const sizeStr = size + '';
  const index = sizeStr.indexOf('.');
  const dou = sizeStr.substring(index + 1, 2);
  if (dou === '00') {
    return sizeStr.substring(0, index) + sizeStr.substring(index + 3, 2);
  }
  return size;
};
