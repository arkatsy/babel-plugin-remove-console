const t = require("@babel/types");

const logLevels = ["log", "warn", "error"];

module.exports = function (_, opts) {
  const excludedProps = Array.isArray(opts?.exclude) ? opts.exclude : [];

  return {
    name: "remove-console",
    visitor: {
      CallExpression(path) {
        const callee = path.get("callee");
        if (!t.isMemberExpression(callee)) return;

        if (isExprConsoleLog(callee, excludedProps)) {
          path.remove();
        }
      },
      VariableDeclarator(path) {
        const init = path.get("init");
        if (!t.isMemberExpression(init)) return;

        if (isExprConsoleLog(init, excludedProps)) {
          const emptyFn = t.functionExpression(null, [], t.blockStatement([]));
          init.replaceWith(emptyFn);
        }
      },
    },
  };
};

function isExprConsoleLog(node, excludedProps) {
  return isSimpleConsoleLog(node, excludedProps) || isBindedConsoleLog(node, excludedProps);
}

function isSimpleConsoleLog(node, excludedProps) {
  const object = node.get("object");
  const property = node.get("property");

  return (
    t.isIdentifier(object.node, { name: "console" }) &&
    !excludedProps.includes(property.node.name) &&
    logLevels.includes(property.node.name)
  );
}

function isBindedConsoleLog(node, excludedProps) {
  const object = node.get("object");
  const property = node.get("property");

  return (
    t.isIdentifier(object.get("object").node, { name: "console" }) &&
    !excludedProps.includes(object.get("property").node.name) &&
    logLevels.includes(object.get("property").node.name) &&
    ["bind", "call", "apply"].includes(property.node.name)
  );
}