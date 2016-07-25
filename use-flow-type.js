'use strict';

module.exports = function(context) {
  var types = Object.create(null);
  function markUsedIfType(ident) {
    if (types[ident.name]) {
      context.markVariableAsUsed(ident.name);
      types[ident.name] = null;
    }
  }
  function markTypeAsUsed(node) {
    context.markVariableAsUsed(node.id.name);
  }
  return {
    DeclareClass: markTypeAsUsed,
    DeclareFunction: markTypeAsUsed,
    DeclareModule: markTypeAsUsed,
    DeclareVariable: markTypeAsUsed,
    ImportDeclaration: function(node) {
      if (node.importKind === 'type') {
        for (var i = 0; i < node.specifiers.length; i++) {
          var specifier = node.specifiers[i];
          types[specifier.local.name] = true;
        }
      }
    },
    TypeAlias: function(node) {
      types[node.id.name] = true;
    },
    GenericTypeAnnotation: function(node) {
      if (node.id.type === 'Identifier') {
        markUsedIfType(node.id);
      } else if (node.id.type === 'QualifiedTypeIdentifier') {
        var qid = node.id;
        do { qid = qid.qualification; } while (qid.qualification);
        markUsedIfType(qid);
      }
    }
  };
};

module.exports.schema = [];
