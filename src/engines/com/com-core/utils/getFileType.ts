export const fileMap: Record<string, string> = {
  excel: ' https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/excel.png',
  image: ' https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/img.png',
  folder: 'https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/floder.png',
  link: ' https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/link.png',
  nan: ' https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/nan.png',
  ppt: ' https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/ppt.png',
  rar: ' https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/rar.png',
  text: ' https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/text.png',
  video: ' https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/video.png',
  audio: ' https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/audio.png',
  word: ' https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/word.png',
  pdf: ' https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/disk/icon/pdf.png',
};
export const words = ['doc', 'docx'];
export const excels = ['xls', 'xlsx', 'xlsm', 'et'];
export const ppts = ['pptx', 'pptm', 'ppt'];
export const pdfs = ['pdf'];
export const txts = ['txt', 'text'];
export const rars = ['rar', 'zip', '7z', 'tar', 'gz', 'bz2'];
export const getFileFType = (v: any) => {
  const type = v.fileType;

  let name = '';
  if (type === 'video') name = 'video';
  if (type === 'audio') name = 'audio';
  if (type === 'image') name = 'image';

  if (words.includes(type)) name = 'word';
  if (excels.includes(type)) name = 'excel';
  if (ppts.includes(type)) name = 'ppt';
  if (pdfs.includes(type)) name = 'pdf';
  if (txts.includes(type)) name = 'word';
  if (rars.includes(type)) name = 'rar';
  return fileMap[name || 'nan'];
};
