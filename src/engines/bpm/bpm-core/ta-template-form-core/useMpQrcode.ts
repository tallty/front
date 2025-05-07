import { compressEncode } from './useCompress';

export const getMpQrcode = (
  path: string,
  scene: string,
  width = 350,
  wechatAppId = process.env.VUE_APP_WECHAT_APP_ID,
) => {
  return `${
    process.env.VUE_APP_API_DOMAIN
  }/wechat/qrcode/image?wechat_app_id=${wechatAppId}&width=${width}&is_hyaline=0&page=${encodeURIComponent(
    path,
  )}${scene ? `&uuid=${encodeURIComponent(scene)}` : ''}`;
  // )}&uuid=${encodeURIComponent(compressEncode(scene))}`;
};
