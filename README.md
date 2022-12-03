# ChatGPT experiment: write a Babel plugin

## What is this?

This is an experiment if [ChatGPT](https://openai.com/blog/chatgpt/) can write a Babel plugin on its own and debug it from feedbacks provided from the external environment.

## Result

- It can write a very basic plugin.
- It could not debug a complex plugin involving recursive lookup for specific nodes. Even if it is given an opportunity to narrow down causes using debug statements, it cannot properly deduce correct conclusion from the debug output. As a result, the proposed fixes all miss the point and the proposed code went back and forth without being improved over time.

## Chat log

See the [commits page](https://github.com/qnighy/chatgpt-experiment-babel-plugin/commits/master) for chat log. Each commit message contains the prompts and the answers.

## Problem 1

Write a babel plugin that transforms

```javascript
const f = (x) => {
  return x * x;
};
```

into:

```javascript
function f(x) {
  return x * x;
}
```

## Answer 1

The commit [b8a75ee](https://github.com/qnighy/chatgpt-experiment-babel-plugin/commit/b8a75eef144a116abf803ab5f59be159589c7995) contains the complete solution:

```javascript
const { functionDeclaration } = require("@babel/types");

const myBabelPlugin = {
  visitor: {
    // This visitor will be applied to all `VariableDeclaration` nodes with `const` or `let` declarations
    VariableDeclaration(path) {
      if (path.node.kind === "const" || path.node.kind === "let") {
        // For each `VariableDeclarator` node in the declaration, we check if it's an arrow function
        path.node.declarations.forEach((declarator) => {
          if (declarator.init && declarator.init.type === "ArrowFunctionExpression") {
            // If it is, we create a new `FunctionDeclaration` node with the same name and function body
            const func = functionDeclaration(
              declarator.id,
              declarator.init.params,
              declarator.init.body,
              declarator.init.generator,
              declarator.init.async
            );

            // And replace the original `VariableDeclarator` node with the new `FunctionDeclaration` node
            path.replaceWith(func);
          }
        });
      }
    }
  }
};
```

## Problem 2

Write a babel plugin that transforms

```javascript
const f = (x) => {
  return x * x;
};
const g = (x) => {
  return this.facor * x;
};
```

into:

```javascript
function f(x) {
  return x * x;
}
const g = (x) => {
  return this.facor * x;
};
```

or in other ways that preserves semantics.

## Answer 2

No, it tried to debug the issue, going back and forth, but it finally did not produces the correct one.
