import { VObject } from '@/lib/vails';
import { ref } from 'vue';
import { createI18n } from 'vue-i18n';
import { merge } from 'lodash-es';

let Taro: any = undefined;

try {
  Taro = require('@tarojs/taro');
} catch {
  console.log('Taro not found');
}

const defaultLang = 'zh-CN';

const loadedLanguages = ref<string[]>([]);

export const loadLanguageMessages = (lang: string) => {
  if (!loadedLanguages.value.includes(lang)) {
    const result: VObject = {};

    const enginesLanguageFiles = require.context(
      `./../../../../engines/`,
      true,
      /^.+\/locales\/lang\/.+\.ts*$/
    );

    enginesLanguageFiles.keys().forEach((fileName) => {
      if (fileName.match(new RegExp(`^.+/locales/lang/${lang}.ts`))) {
        const file = enginesLanguageFiles(fileName);
        merge(result, file.default);
      }
    });
    try {
      const taComponentLanguageFiles = require.context(
        `./../../../../components/global/ta-component/locales/lang/`,
        false,
        /\.ts$/
      );

      taComponentLanguageFiles.keys().forEach((fileName) => {
        if (fileName.match(new RegExp(`/${lang}.ts$`))) {
          const file = taComponentLanguageFiles(fileName);
          merge(result, file.default);
        }
      });
    } catch (e) {
      console.log(e);
    }

    try{
      const taMobileComponentLanguageFiles = require.context(
        `./../../../../components/global/ta-mobile-component/locales/lang/`,
        false,
        /\.ts$/
      );

      taMobileComponentLanguageFiles.keys().forEach((fileName) => {
        if (fileName.match(new RegExp(`/${lang}.ts$`))) {
          const file = taMobileComponentLanguageFiles(fileName);
          merge(result, file.default);
        }
      });
    }catch(e){
      console.log(e);
    }

    try{
      const languageFiles = require.context(
        `./../../../../locales/lang/`,
        false,
        /\.ts$/
      );

      languageFiles.keys().forEach((fileName) => {
        if (fileName.match(new RegExp(`/${lang}.ts$`))) {
          const file = languageFiles(fileName);
          merge(result, file.default);
        }
      });
    }catch(e){
      console.log(e);
    }

    const currentLocale = i18n.global;
    currentLocale.setLocaleMessage(lang, result);

    loadedLanguages.value.push(lang);
  }

  return lang;
};

export const setLocale = (lang: string) => {
  localStorage.setItem('Accept-Lang', lang);
  Taro?.setStorageSync('Accept-Lang', lang);
  i18n.global.locale.value = lang;
};

export const getLocale = () => {
  if (
    Taro?.getStorageSync('Accept-Lang') ||
    localStorage.getItem('Accept-Lang')
  ) {
    i18n.global.locale.value =
      Taro?.getStorageSync('Accept-Lang') ||
      localStorage.getItem('Accept-Lang') ||
      defaultLang;
  }

  return i18n.global.locale.value;
};

const i18n = createI18n({
  missingWarn: false,
  fallbackWarn: false,
  legacy: false,
  locale: defaultLang,
  messages: {},
});

loadLanguageMessages(defaultLang);

export default i18n;
