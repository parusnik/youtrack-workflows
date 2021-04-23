/**
 * Copyright (c) Parusnik.
 * Licensed under the MIT License.
 */

var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');
  
exports.rule = entities.Issue.onChange({
  title: 'Блокировать поле "Время таймера"',
  guard: (ctx) => {
    const issueFields = ctx.issue.fields;
    return issueFields.isChanged(ctx.TimerTime);
  },
  action: (ctx) => {
    const issue = ctx.issue;
    workflow.check(issue.fields.becomes(ctx.Timer, ctx.Timer.Start) || issue.fields.becomes(ctx.Timer, ctx.Timer.Stop) && ctx.TimerTime, 
        workflow.i18n('"Время таймера" заблокировано для изменений'));
  },
  requirements: {
    Timer: {
      type: entities.EnumField.fieldType,
      name: 'Таймер',
      Stop: {
        name: 'Остановлен'
      },
      Start: {
        name: 'Запущен'
      }
    },
    TimerTime: {
      type: entities.Field.dateTimeType,
      name: 'Время таймера'
    }
  }
})