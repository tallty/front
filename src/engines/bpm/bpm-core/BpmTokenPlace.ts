import { DataForm } from '@/components/global/ta-component/ta-template-form-core/data_form/data_form';
import { Place, Token, TokenPlace } from './types';
import { FormSetting } from '@/components/global/ta-component/ta-template-form-core/data_form/form_setting';
import { uniqBy } from 'lodash-es';

export class BpmTokenPlace {
  data: TokenPlace;

  constructor(data: TokenPlace) {
    this.data = data;
  }

  get place(): BpmTokenPlacePlace {
    return new BpmTokenPlacePlace(this.data.place, this);
  }

  get tokens(): BpmTokenPlaceToken[] {
    return (this.data.tokens || []).map(
      (token) => new BpmTokenPlaceToken(token, this)
    );
  }

  get dataFormExists(): boolean {
    return this.tokens.some(
      (token: BpmTokenPlaceToken) => token.dataFormExists
    );
  }

  get dataFormsHasStatisticsComponentAry(): DataForm[] {
    const result: DataForm[] = [];
    this.tokens.forEach(
      (token: BpmTokenPlaceToken) =>
        token.dataFormExists &&
        token.dataForms.forEach((dataForm: DataForm) => {
          if (dataForm.customStatisticsComponent) {
            result.push(dataForm);
          }
        })
    );
    return uniqBy(result, (dataForm: DataForm) => dataForm.value.form_conf_seq);
  }
}

export class BpmTokenPlaceToken {
  data: Token;
  bpmTokenPlace?: BpmTokenPlace;

  constructor(data: Token, tokenPlace?: BpmTokenPlace) {
    this.data = data;
    this.bpmTokenPlace = tokenPlace;
  }

  get dataForms() {
    return (this.data?.data_forms || []).map(
      (dataForm) =>
        new DataForm(
          dataForm,
          this.bpmTokenPlace
            ? this.bpmTokenPlace.place.data.form_setting
            : undefined
        )
    );
  }

  get dataFormsHasRecordAry() {
    return this.dataForms.filter((dataForm) => dataForm.record);
  }

  get dataFormsHasRecordExists() {
    return this.dataFormsHasRecordAry.length > 0;
  }

  get dataFormExists(): boolean {
    return this.dataForms.some((dataForm: DataForm) => !dataForm.isEmpty);
  }
}

export class BpmTokenPlacePlace {
  data: Place;
  bpmTokenPlace?: BpmTokenPlace;

  constructor(data: Place, tokenPlace?: BpmTokenPlace) {
    this.data = data;
    this.bpmTokenPlace = tokenPlace;
  }

  get formSetting() {
    return this.data.form_setting
      ? new FormSetting(this.data.form_setting)
      : undefined;
  }
}
