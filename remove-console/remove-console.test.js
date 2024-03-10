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
      title: "Basic and top-level console.log",
      code: `
      console.log("Hello");
      function a() {
        console.log("Hello");
      }
      a();
    `,
      output: `
      function a() {}
      a();`,
    },
    {
      title: "console.log re-assigns",
      code: `
      const log = console.log;
      log("Hello");`,
      output: `
      const log = function () {};
      log("Hello");`,
    },
    {
      title: "Short-circuit evaluations",
      code: `
      true && console.log("Hello");`,
      output: `
      true;`
    }
  ],
});
