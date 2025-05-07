import { VObject } from '@/lib/vails';

export const preinstalledTokenSourceConfig: VObject = {
  'Assessment::Evaluation': {
    name: '考核评价',
    defaultValue: {
      klass: 'Assessment::Evaluation',
      options: {
        component: 'ComBpmTokenSourceAssessmentEvaluationStatisticsTable',
        complete_component: 'ComBpmTokenSourceAssessmentEvaluationDrawer',
        configuration_component: 'ComBpmTokenSourceAssessmentEvaluationConfiguration',
      },
      association: 'evaluations',
      default_values: {
        score_template_id: 1,
      },
      model_setting_flag: 'model',
    },
  },
};
