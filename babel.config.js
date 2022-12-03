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

module.exports = {
  plugins: [myBabelPlugin],
};
