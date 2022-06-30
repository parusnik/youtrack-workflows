/**
 * Copyright (c) Parusnik.
 * Licensed under the MIT License.
 */

const entities = require('@jetbrains/youtrack-scripting-api/entities');
const workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Fix parent when all subtasks are resolved',
  guard: (ctx) => {
    return ctx.issue.isReported && ctx.issue.becomesResolved;
  },
  action: (ctx) => {
    const processParent = function(issue) {
      if (issue.links['subtask of'].isEmpty()) {
        return;
      }
      const parent = issue.links['subtask of'].first();
      if (parent && parent.project && !parent.project.isArchived &&
          parent.isReported && !parent.isResolved) {
        const unresolvedSubtask = parent.links['parent for'].find(function(subtask) {
          return subtask.isReported && !(subtask.fields.State && subtask.fields.State.isResolved);
        });
        if (!unresolvedSubtask) {
          const field = parent.project.findFieldByName(ctx.State.name);
          if (field) {
            const value = field.findValueByName(ctx.State.Done.name);
            if (value) {
              parent.State = value;
              if (parent.isVisibleTo(ctx.currentUser)) {
                workflow.message(workflow.i18n('Automatically set {0} as Done', parent.id));
              }
              return parent;
            }
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
      Done: {}
    }
  }
});