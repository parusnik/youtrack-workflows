/**
 * Copyright (c) Parusnik.
 * Licensed under the MIT License.
 */

var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Блокировать изменение запущенного таймера',
  guard: (ctx) => {
    return ctx.issue.fields.becomes(ctx.Timer, ctx.Timer.Start)
  },
  action: (ctx) => {
    const timerAssignee = ctx.issue.fields.TimerAssignee;
    workflow.check(timerAssignee && timerAssignee.login === ctx.currentUser.login,
        'Только пользователь запустивший таймер может остановить его!');
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
})