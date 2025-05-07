<script lang="ts">
import { ComAdminModelSettingsApi } from '@/engines/com/apis/com/admin/model_settings.api';
import { ComAdminModelDefinesApi } from '@/engines/com/apis/com/admin/model_defines.api';
import { defineComponent } from 'vue';
import { VStore, VModel, VObject } from '@/lib/vails';
import { ComModelSetting, ComModelDefine } from '@/engines/com/types/model';
import FileSaver from 'file-saver';
import { message } from 'ant-design-vue';

const ComResAdminMembersIndex = defineComponent({
  name: 'ComComAdminModelSettingsIndex',
  components: {},
  setup() {
    const identityStore = new VStore(new ComAdminModelDefinesApi());
    const store = new VStore(new ComAdminModelSettingsApi());

    const identityTemplate = {
      key: 'layout_1619505190584_0',
      type: 'layout',
      model: {},
      fields: [
        {
          key: 'layout_1619505807980_9',
          name: '普通布局',
          type: 'layout',
          fields: [
            {
              key: 'label_1619528569749_0',
              name: '类型信息',
              type: 'label',
              model: {
                attr_type: 'string',
              },
              rules: [],
              fields: [],
              options: {
                span: 24,
              },
              model_key: 'label_1619528569749_0',
              conditions: [],
              model_key_prefix: '',
            },
            {
              key: 'input_1619505194264_1',
              name: '中文名称',
              type: 'input',
              model: {
                attr_type: 'string',
              },
              rules: [
                {
                  message: '请填写正确的中文名称',
                  required: true,
                  rule_type: 'required',
                },
              ],
              fields: [],
              options: {
                icon: '',
                span: 24,
              },
              model_key: 'name',
              conditions: [],
              model_key_prefix: '',
            },
            {
              key: 'input_1619505194417_2',
              name: '英文名称',
              type: 'input',
              model: {
                attr_type: 'string',
              },
              rules: [
                {
                  message: '请填写正确的类名',
                  required: true,
                  rule_type: 'required',
                },
              ],
              fields: [],
              options: {
                span: 24,
              },
              model_key: 'klass',
              conditions: [],
              model_key_prefix: '',
            },
            {
              key: 'array_1619505194417_2',
              name: '查询链',
              type: 'string_array',
              model: {
                attr_type: 'array',
              },
              fields: [],
              options: {
                span: 24,
              },
              model_key: 'association_chain',
              conditions: [],
              model_key_prefix: '',
            },
          ],
          options: {
            span: 24,
            label: {
              align: 'left',
              width: 60,
            },
          },
          model_key: 'layout_1619505807980_9',
          conditions: [],
          model_key_prefix: '',
        },
      ],
      model_key: 'layout_1619505190584_0',
      conditions: [],
    };

    const template = {
      key: 'layout_1619505344237_3',
      type: 'layout',
      model: {},
      fields: [
        {
          key: 'layout_1619505826838_10',
          name: '普通布局',
          type: 'layout',
          fields: [
            {
              key: 'label_1619529761819_0',
              name: '模型信息',
              type: 'label',
              model: {
                attr_type: 'string',
              },
              rules: [],
              fields: [],
              options: {
                span: 24,
              },
              model_key: 'label_1619529761819_0',
              conditions: [],
              model_key_prefix: '',
            },
            {
              key: 'input_1619505345509_4',
              name: '业务名称英文',
              type: 'input',
              model: {
                attr_type: 'string',
              },
              rules: [],
              fields: [],
              options: {
                span: 24,
              },
              model_key: 'flag',
              conditions: [],
              model_key_prefix: '',
            },
            {
              key: 'input_1619505348360_5',
              name: '业务名称中文',
              type: 'input',
              model: {
                attr_type: 'string',
              },
              rules: [],
              fields: [],
              options: {
                span: 24,
              },
              model_key: 'flag_name',
              conditions: [],
              model_key_prefix: '',
            },
            {
              key: 'input_1619505348360_6',
              name: 'setable_type',
              type: 'input',
              model: {
                attr_type: 'string',
              },
              rules: [],
              fields: [],
              options: {
                span: 24,
              },
              model_key: 'setable_type',
              conditions: [],
              model_key_prefix: '',
            },
            {
              key: 'input_1619505348360_7',
              name: 'setable_id',
              type: 'input',
              model: {
                attr_type: 'string',
              },
              rules: [],
              fields: [],
              options: {
                span: 24,
              },
              model_key: 'setable_id',
              conditions: [],
              model_key_prefix: '',
            },
            {
              key: 'input_1619505348360_8',
              name: 'workflow_id',
              type: 'input',
              model: {
                attr_type: 'string',
              },
              rules: [],
              fields: [],
              options: {
                span: 24,
              },
              model_key: 'bpm_workflow_id',
              conditions: [],
              model_key_prefix: '',
            },
            // {
            //   key: 'input_number_1619505348360_10',
            //   name: 'ref_model_setting_id',
            //   type: 'number',
            //   model: {
            //     attr_type: 'number',
            //   },
            //   rules: [],
            //   fields: [],
            //   options: {
            //     span: 24,
            //   },
            //   model_key: 'ref_model_setting_id',
            //   conditions: [],
            //   model_key_prefix: '',
            // },
            // {
            //   key: 'input_number_1619505348360_101',
            //   name: 'ref_model_setting_flag',
            //   type: 'input',
            //   model: {
            //     attr_type: 'string',
            //   },
            //   rules: [],
            //   fields: [],
            //   options: {
            //     span: 24,
            //   },
            //   model_key: 'ref_model_setting_flag',
            //   conditions: [],
            //   model_key_prefix: '',
            // },
            // {
            //   key: 'forms_template_1619505577096_8',
            //   name: '模板',
            //   type: 'form_designer',
            //   model: {
            //     attr_type: 'array',
            //   },
            //   rules: [],
            //   fields: [],
            //   options: {
            //     span: 24,
            //   },
            //   model_key: 'form',
            //   conditions: [],
            //   model_key_prefix: '',
            // },
            {
              key: 'forms_template_1619505577096_8',
              name: '模板配置',
              type: 'form_setting_designer',
              model: {
                attr_type: 'object',
              },
              rules: [],
              fields: [],
              options: {
                span: 24,
              },
              model_key: 'form_setting',
              conditions: [],
              model_key_prefix: '',
            },
            {
              key: 'forms_template_1619505577096_81',
              name: 'en 模板配置',
              type: 'form_setting_designer',
              model: {
                attr_type: 'object',
              },
              rules: [],
              fields: [],
              options: {
                span: 24,
              },
              model_key: 'i18n_form_setting.en',
              conditions: [],
              model_key_prefix: '',
            },
          ],
          options: {
            span: 24,
            label: {
              align: 'left',
              width: 400,
            },
          },
          model_key: 'layout_1619505826838_10',
          conditions: [],
          model_key_prefix: '',
        },
      ],
      model_key: 'layout_1619505344237_3',
      conditions: [],
    };

    const searchVariables = ['name', 'klass', 'klass_singular'];

    const extraConfig = {
      searcherSimpleOptions: [
        { key: 'flag', label: '名称', type: 'string' },
        { key: 'flag_name', label: '英文名', type: 'string' },
      ],
    };

    const exportModelSettings = (identity: ComModelDefine) => {
      store.records.value.forEach((modelSetting: VModel<ComModelSetting> & ComModelSetting) => {
        modelSetting.fetch().then(() => {
          onExport(
            modelSetting.form_setting.setting?.confs?.[0]?.conf?.form || {},
            `${identity.klass_singular}#${modelSetting.flag}.json`,
          );
        });
      });
    };

    const onExport = (value: VObject, filename = `${Date.now()}.json`) => {
      const jsonString = JSON.stringify(value);
      const blob = new Blob([jsonString], { type: 'application/json' });
      FileSaver.saveAs(blob, filename);
    };

    return {
      identityStore,
      store,
      identityTemplate,
      template,
      searchVariables,
      extraConfig,
      exportModelSettings,
    };
  },
});

export default ComResAdminMembersIndex;
</script>

<template lang="pug">
.com-res-admin-members-index
  ComIdentityEditor(
    recordName='模型设置'
    :store='store'
    :recordTemplate='template'
    identityName='模型定义'
    :identityStore='identityStore'
    :identityTemplate='identityTemplate'
    :searchVariables="searchVariables"
    :extraConfig='extraConfig',
    parentType='model_defines'
    recordForeignKey="model_define_id"
  )
    template(#default='{ actions }')
      a-table-column(:autoHeight='true' title='id' data-index='id')
      a-table-column(:autoHeight='true' title='业务名称中文' data-index='flag_name')
      a-table-column(:autoHeight='true' title='业务名称英文' data-index='flag')
      a-table-column(:autoHeight='true' title='setable_type' data-index='setable_type')
      a-table-column(:autoHeight='true' title='setable_id' data-index='setable_id')
      a-table-column(:autoHeight='true' title='workflow_id' data-index='bpm_workflow_id')
      a-table-column(:autoHeight='true' title='工作流名称' data-index='bpm_workflow_name')
      //- a-table-column(:autoHeight='true' title='ref_model_setting_id' data-index='ref_model_setting_id')
      //- a-table-column(:autoHeight='true' title='ref_model_setting_flag' data-index='ref_model_setting_flag')
    template(#identity='{ record, isActive, actions }')
      .identity-box
        .card.flex(:class="{ 'active-card': isActive }")
          .card-header.flex-between
            .title.break-all
              .name {{ record.name }}
              .klass {{ record.klass || '-' }}
            .actions.flex-shrink-0
              TaIcon.icon.clickable(type='EditOutlined' @click.stop='actions.onEdit(record)')
              TaPopoverConfirm(title='删除' content='确认删除改模型定义吗？' @confirm='actions.onDelete(record)')
                TaIcon.icon(type='DeleteOutlined')
          .card-icon-box.flex
            //- .icon-item.lined
            //-   TaIcon.icon(type="CopyOutlined")
            //-   |  · 8
            //- .icon-item
            //-   TaIcon.icon(type="ApartmentOutlined")
            //-   |  · 8

    template(#right-header='{ record }')
      .active-title
        ComIconText(
          :text="record.name || '全部'"
        )

    template(#right-right-actions='{ identity }')
      TaTextButton(icon='DownloadOutlined', @click='exportModelSettings(identity)') 导出 JSON 文件

</template>

<style lang="stylus" scoped>
.com-res-admin-members-index
  height 100%
  width 100%
  flex 1
.identity-box
  padding 1px 6px
.card
  height 100px
  width 100%
  padding 14px 12px
  cursor pointer
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #D9D9D9;
  margin-bottom 16px
  flex-wrap wrap
  transition: .1s;
  .card-header
    width 100%
    flex 1
    justify-content space-between
    align-items flex-start
    align-self flex-start
    color #595959
    .actions
      display none
      margin-right -10px
      .icon
        margin-right 10px
    .name
      font-size 16px
      font-weight 500
    .klass
      font-size 12px
      font-weight 500
      color #8C8C8C
    .icon
      height 20px
      color #A6A6A6
      font-size 16px

  .card-icon-box
    display flex
    align-self flex-end
    .icon-item
      margin-left 16px
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8C8C8C;
      .icon
        color #8591A2
    .lined
      margin-left auto
.active-card
  margin-top: -1px;
  box-shadow: 0 2px 4px -1px rgba(0 0 0 0.3)
  .name
    color $primary-color
.card:hover
  margin-top: -1px;
  box-shadow: 0 2px 4px -1px rgba(0 0 0 0.3)
  .name
    color $primary-color
  .actions
    display block
.active-title
  display flex
  align-items center
  font-size 20px
  font-weight 400
  color #595959
  .text
    .name
      margin-right 6px
  .icon-box
    margin-right 6px
    color #83C6EF
    font-size 22px
</style>
