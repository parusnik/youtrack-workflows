/**
 * Copyright (c) Parusnik.
 * Licensed under the MIT License.
 */

 var entities = require('@jetbrains/youtrack-scripting-api/entities');
 var workflow = require('@jetbrains/youtrack-scripting-api/workflow');
 
 exports.rule = entities.Issue.onChange({
   title: 'Блокировать поле "Таймер запущен"',
   guard: (ctx) => {
     const issueFields = ctx.issue.fields;
     return issueFields.isChanged(ctx.TimerAssignee);
   },
   action: (ctx) => {
     const issue = ctx.issue;
     workflow.check(issue.fields.becomes(ctx.Timer, ctx.Timer.Stop) && !ctx.TimerAssignee || ctx.TimerAssignee.login !== ctx.currentUser.login, workflow.i18n('Таймер запущен заблокировано для изменений'));
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
     TimerAssignee: {
       type: entities.User.fieldType,
       name: 'Таймер запущен'
     }
   }
 })