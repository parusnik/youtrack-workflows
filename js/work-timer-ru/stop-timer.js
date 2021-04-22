var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: workflow.i18n('Stop timer when the value for "Timer" becomes "Stop"'),
  guard: function(ctx) {
    return ctx.issue.fields.becomes(ctx.Timer, ctx.Timer.Stop) && ctx.issue.fields.TimerTime;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    if (issue.fields.oldValue(ctx.Timer).name === ctx.Timer.Start.name) {
      var newWorkItem = {
        description: workflow.i18n('The work item automatically added by the timer.'),
        date: Date.now(),
        author: ctx.currentUser,
        duration: issue.project.intervalToWorkingMinutes(issue.fields.TimerTime, Date.now())
      };
      issue.addWorkItem(newWorkItem);
      workflow.message(workflow.i18n('Work time added'));
    } else {
      workflow.message(workflow.i18n('Looks like the timer hasn\'t been started.'));
    }
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
});