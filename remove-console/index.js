module.exports = function ({ types: t }) {
  return {
    name: "remove-console",
    visitor: {
      VariableDeclarator(path) {
        const init = path.node.init;

        if (init.object.name === "console" && init.property.name === "log") {
          path.node.init = t.functionExpression(null, [], t.blockStatement([]));
        }
      },
      CallExpression(path) {
        const callee = path.node.callee;
        if (!t.isMemberExpression(callee)) return;

        const parent = path.parent;
        if (t.isLogicalExpression(parent)) {
          const void0 = t.unaryExpression("void", t.numericLiteral(0));
          path.replaceWith(void0);
          return;
        }

        if (callee.object.name === "console" && callee.property.name === "log") {
          path.remove();
          // return;
        }
      },
    },
  };
};
