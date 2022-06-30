/**
 * Copyright (c) Parusnik.
 * Licensed under the MIT License.
 */

const entities = require('@jetbrains/youtrack-scripting-api/entities');
const workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Open parent task when subtask changes to an unresolved state',
  guard: (ctx) => {
    return ctx.issue.isReported && ctx.issue.becomesUnresolved;
  },
  action: function (ctx) {
    const processParent = function(issue) {
      if (issue.links['subtask of'].isEmpty()) {
        return;
      }
      const parent = issue.links['subtask of'].first();
      if (parent && parent.project && !parent.project.isArchived && parent.isReported && parent.isResolved) {
        const field = parent.project.findFieldByName(ctx.State.name);
        if (field) {
          const value = field.findValueByName(ctx.State.Open.name);
          if (value) {
            parent.State = value;
            workflow.message(workflow.i18n('Automatically reopen {0}', parent.id));
            return parent;
          }
        }
      }
    };

    let issue = ctx.issue;
    while (issue) {
      issue = processParent(issue);
    }
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Open: {}
    }
  }
});