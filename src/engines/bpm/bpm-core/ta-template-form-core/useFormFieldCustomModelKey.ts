import { computed } from 'vue';
import { TaTemplateFormModelKeyConfiguration } from './types';
import { get, set } from 'lodash-es';
import { getTaTemplateFormItemValueKey } from './useGetFormValue';

export const useFormFieldCustomModelKey = (props: any, formComponent: any) => {
  const customModelKeyAccessorProps = computed(() =>
    (props.item.model_key_configuration || [])
      .map((configuration: TaTemplateFormModelKeyConfiguration) => {
        const modelKey = getTaTemplateFormItemValueKey(props.item, configuration.model_key);
        return {
          [configuration.key]: get(formComponent.value, modelKey),
          [`onUpdate:${configuration.key}`]: (value: any) => {
            set(formComponent.value, modelKey, value);
          },
        };
      })
      .reduce((acc: any, cur: any) => ({ ...acc, ...cur }), {}),
  );

  return {
    customModelKeyAccessorProps,
  };
};
