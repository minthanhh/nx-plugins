// const { readdirSync } = require('fs');
// const { extname } = require('path');

// const items = readdirSync('.');

// const schema = `import { defineCollection } from 'astro:content';
// import { docsSchema } from '@astrojs/starlight/schema';

// export const collections = {
// 	docs: defineCollection({ schema: docsSchema() }),
// };
// `;

// items.forEach((item) => {
//   console.log(extname(item));
// });

// const jsxImportSource = schema.match(/\/\*\*.*?\*\//s);
// console.log(jsxImportSource);

// const array = [
//   '/** @jsxImportSource react */\n\nimport { useState, type ReactNode } from \'react\';\n\n/** A counter written with React */\nexport default function Counter({ children }: { children?: ReactNode }) {\n  const [count, setCount] = useState(0);\n  const add = () => setCount((i) => i + 1);\n  const subtract = () => setCount((i) => i - 1);\n\n  return (\n    <>\n      {children}\n      <div className="counter">\n        <button onClick={subtract}>-</button>\n        <pre>{count}</pre>\n        <button onClick={add}>+</button>\n      </div>\n    </>\n  );\n}',
//   ' `/** @jsxImportSource solid-js */\n\nimport { createSignal, type JSXElement } from \'solid-js\';\n\nexport default function SolidCounter({ children }: { children: JSXElement }) {\n  const [count, setCount] = createSignal(0);\n  const add = () => setCount(count() + 1);\n  const subtract = () => setCount(count() - 1);\n\n  return (\n    <>\n      {children}\n      <div class="counter">\n        <button onClick={subtract}>-</button>\n        <pre>{count()}</pre>\n        <button onClick={add}>+</button>\n      </div>\n    </>\n  );\n}',
//   ' `/** @jsxImportSource preact */\n\nimport { createSignal, type JSXElement } from \'solid-js\';\n\nexport default function SolidCounter({ children }: { children: JSXElement }) {\n  const [count, setCount] = createSignal(0);\n  const add = () => setCount(count() + 1);\n  const subtract = () => setCount(count() - 1);\n\n  return (\n    <>\n      {children}\n      <div class="counter">\n`',
//   ' `import { createSignal, type JSXElement } from "@astrojs/starlight";\n\nexport default function SolidCounter({ children }: { children: JSXElement }) {\n  const [count, setCount] = createSignal(0);\n  const add = () => setCount(count() + 1);\n  const subtract = () => setCount(count() - 1);\n\n  return (\n    <>\n      {children}\n      <div class="counter">\n`',
// ];

// const integration = [];

// array.forEach((item) => {
//   if (regex.test(item)) {
//     integration.push(item.match(regex)[1]);
//   }
//   if (regexImport.test(item)) {
//     integration.push(item.match(regexImport));
//   }
// });

// console.log(integration);

// const extname = ['.tsx', '.jsx'];

// for (const ext of extname) {
//   if (ext === '.tsx' || '.jsx') {
//     console.log(ext.split('.')[1]);
//   }
// }

const exts = ['.tsx', '.jsx', '.ts', '.svelte', '.vue'];

let tsx = [];
const svelteVue = [];

function test() {}

for (const ext of exts) {
  if (ext === '.jsx' || '.tsx' || '.ts') {
    tsx.push(ext);
  }

  if (ext === ('.svelte' || '.vue')) {
    svelteVue.push(ext);
  }
}

console.log(tsx);
console.log(svelteVue);
