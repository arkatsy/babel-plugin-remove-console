const t = require("@babel/types");

module.exports = function () {
  return {
    name: "remove-console",
    visitor: {
      CallExpression(path) {
        const callee = path.get("callee");
        if (!t.isMemberExpression(callee)) return;

        if (isExprConsoleLog(callee)) {
          path.remove();
        }
      },
      VariableDeclarator(path) {
        const init = path.get("init");
        if (!t.isMemberExpression(init)) return;

        if (isExprConsoleLog(init)) {
          const emptyFn = t.functionExpression(null, [], t.blockStatement([]));
          init.replaceWith(emptyFn);
        }
      },
    },
  };
};

function isExprConsoleLog(node) {
  return isSimpleConsoleLog(node) || isBindedConsoleLog(node);
}

function isSimpleConsoleLog(node) {
  const object = node.get("object");
  const property = node.get("property");
  return (
    t.isIdentifier(object.node, { name: "console" }) &&
    t.isIdentifier(property.node, { name: "log" })
  );
}

function isBindedConsoleLog(node) {
  const object = node.get("object");
  const property = node.get("property");

  return (
    t.isIdentifier(object.get("object").node, { name: "console" }) &&
    t.isIdentifier(object.get("property").node, { name: "log" }) &&
    ["bind", "call", "apply"].includes(property.node.name)
  );
}
