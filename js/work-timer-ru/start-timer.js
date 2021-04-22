/**
 * Copyright (c) Parusnik.
 * Licensed under the MIT License.
 */

var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: workflow.i18n('Start timer when the value for "Timer" becomes "Start"'),
  guard: (ctx) => {
    const issue = ctx.issue;
    return issue.fields.becomes(ctx.Timer, ctx.Timer.Start) && !issue.fields.TimerAssignee;
  },
  action: (ctx) => {
    ctx.issue.fields.TimerTime = Date.now();
    ctx.issue.fields.TimerAssignee = ctx.currentUser;
    workflow.message(workflow.i18n('The timer is started.'));
  },
  requirements: {
    Timer: {
      type: entities.EnumField.fieldType,
      name: 'Таймер',
      Start: {
        name: 'Запущен'
      }
    },
    TimerTime: {
      type: entities.Field.dateTimeType,
      name: 'Время таймера'
    },
    TimerAssignee: {
      type: entities.User.fieldType,
      name: 'Таймер запущен'
    }
  }
});