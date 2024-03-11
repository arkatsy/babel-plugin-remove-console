const { pluginTester } = require("babel-plugin-tester");
const plugin = require("./index");
const path = require("node:path");
const { describe, it } = require("node:test");

globalThis.describe = describe;
globalThis.it = it;

pluginTester({
  plugin,
  tests: [
    {
      title: "Remove top-level console.log",
      code: `console.log(4);`,
      output: ``,
    },
    {
      title: "Remove simple block-scoped console.log",
      code: `
      function foo() { console.log(4); }
      const bar = () => { console.log(4); }
      if(true) { console.log(4); }`,
      output: `
      function foo() {}
      const bar = () => {};
      if (true) {
      }`,
    },
    {
      title: "Remove console.log from short-circuits (&& || ??)",
      code: `
      true && console.log(4);
      console.log(4) || false;
      console.log(4) ?? (false || true);
      (false || (true && console.log(4))) ?? false;`,
      output: `
      true;
      false;
      false || true;
      (false || true) ?? false;`,
    },
    {
      title: "Handle re-assignent of console.log",
      code: `
      const log = console.log;
      log(4);`,
      output: `
      const log = function () {};
      log(4);`,
    },
    {
      title: "Handle control-flow without block",
      code: `
      if (true) console.log(4)
      for (;;) console.log(4)
      for (const i in []) console.log(i)
      for (const i of []) console.log(i)
      while (true) console.log(4)
      do console.log(4); while (false)`,
      output: `
      if (true) {
      }
      for (;;) {}
      for (const i in []) {
      }
      for (const i of []) {
      }
      while (true) {}
      do {} while (false);`,
    },
    {
      title: "Remove console.log with context binding (.bind, .call, .apply)",
      code: `
      console.log.bind(console, 4);
      console.log.call(console, 4);
      console.log.apply(console, [4]);`,
      output: ``,
    },
    {
      title: "Should work with custom options about excluding certain log levels",
      pluginOptions: {
        exclude: ["warn", "error"],
      },
      code: `
      console.log(4);
      console.warn(4);
      console.error(4);
      console.warn.bind(console, 4);`,
      output: `
      console.warn(4);
      console.error(4);
      console.warn.bind(console, 4);`,
    },
  ],
});
