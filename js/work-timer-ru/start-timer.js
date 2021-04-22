var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: workflow.i18n('Start timer when the value for "Timer" becomes "Start"'),
  guard: function(ctx) {
    return ctx.issue.fields.becomes(ctx.Timer, ctx.Timer.Start);
  },
  action: function(ctx) {
    ctx.issue.fields.TimerTime = Date.now();
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
    }
  }
});