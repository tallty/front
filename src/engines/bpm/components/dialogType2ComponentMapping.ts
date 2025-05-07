// NOTE: require 或 import 地址不可使用变量，所以只能一个个写出来

let plan_token: any = null;
try {
  plan_token =
    require('@/engines/plan/components/plan/ComPlanTaskWithTokenDetailEasyDialog.vue').default;
} catch {
  console.log('plan_token not found');
}

let plan_task: any = null;
try {
  plan_task =
    require('@/engines/plan/components/plan/ComPlanTaskWithTokenDetailEasyDialog.vue').default;
} catch {
  console.log('plan_task not found');
}

let exp_entry: any = null;
try {
  exp_entry =
    require('@/engines/exp/components/exp/entries/ComExpEntryStateMachineDialog.vue').default;
} catch {
  console.log('exp_entry not found');
}

let bpm_instance: any = null;
try {
  bpm_instance = require('@/engines/bpm/components/ComBpmInstanceDetailDialog.vue').default;
} catch {
  console.log('bpm_instance not found');
}

let exp_entry_normal: any = null;
try {
  exp_entry_normal = require('@/engines/exp/components/exp/entries/ComExpEntryDialog.vue').default;
} catch {
  console.log('exp_entry_normal not found');
}

let hr_entry: any = null;
try {
  hr_entry = require('@/engines/hr/components/hr/entries/ComHrEntryStateMachineDialog.vue').default;
} catch {
  console.log('hr_entry not found');
}

let estate_contract: any = null;
try {
  estate_contract =
    require('@/components/global/ComEstateContractStateMachineDetailDialog.vue').default;
} catch {
  console.log('estate_contract not found');
}

let travel_payment: any = null;
try {
  travel_payment =
    require('@/engines/travel/components/travel/payments/ComTravelPaymentEasyDetailDialog.vue').default;
} catch {
  console.log('travel_payment not found');
}

let pms_task: any = null;
try {
  pms_task = require('@/engines/pms/components/pms/tasks/ComPmsTasksShowIdDialog.vue').default;
} catch {
  console.log('pms_task not found');
}

export const bpmInstanceDialogType2ComponentMapping = {
  plan_token,
  plan_task,
  exp_entry,
  exp_entry_normal,
  hr_entry,
  bpm_instance,
  estate_contract,
  travel_payment,
  pms_task,
};
