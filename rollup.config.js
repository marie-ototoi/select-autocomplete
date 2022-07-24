import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import styles from "rollup-plugin-styles";
import dts from "rollup-plugin-dts";

const packageJson = require("./package.json");

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve(),
      styles({
        modules: true,
      }),
      commonjs(),
      babel({
        babelHelpers: "runtime",
        comments: false,
        plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]],
      }),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
    ],
    external: [
      ...Object.keys(packageJson.dependencies),
      ...Object.keys(packageJson.devDependencies),
      ...Object.keys(packageJson.peerDependencies),
    ],
  },
  {
    input: "./lib/index.d.ts",
    output: [{ file: "lib/select-autocomplete.d.ts", format: "es" }],
    plugins: [dts()],
  },
];

export default config;
