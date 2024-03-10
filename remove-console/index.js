/*

Cases:
-----------------

- Simple Statements
console.log("Hello");

- Context Binding
console.log.call(null, "Hello");
console.warn.bind(null, "Hello");
console.log.apply(null, ["Hello"]);

- Different levels
console.warn("Hello");
console.log("Hello");
console.error("Hello");
console.info("Hello");

- Callbacks
[1, 2, 3].map(console.log);

- Ternaries & short-circuit evaluations
true && console.log("Hello");
false || console.log("Hello");
true ? console.log("Hello") : console.warn("Hello");

- console.log to a variable
const log = console.log;
const { warn } = console;
log("Hello");
warn("Hello");

- Should NOT remove redefinds
console = { log: () => {} };

- Function calls inside logs should still be executed (for side-effects)
let m = 0;
function a() {
    m++;
    console.log("Hello");
    return 5;
}
console.log("Hello", a());

*/

module.exports = function ({ types: t }) {
  return {
    name: "remove-console",
    visitor: {
      VariableDeclarator(path) {
        const init = path.node.init;

        if (!t.isMemberExpression(init)) return;

        if (init.object.name === "console" && init.property.name === "log") {
          path.node.init = t.functionExpression(null, [], t.blockStatement([]));
        }
      },
      CallExpression(path) {
        const callee = path.node.callee;

        if (!t.isMemberExpression(callee)) return;

        if (callee.object.name === "console" && callee.property.name === "log") {
          path.remove();
        }
      },
    },
  };
};
