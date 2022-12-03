const t = require("@babel/types");

module.exports = function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        // If the original arrow function uses this, we bind the correct this value to the function
        if (path.node.id && path.node.id.name === "this") {
          path.node.declarations.forEach((decl) => {
            if (t.isArrowFunctionExpression(decl.init)) {
              console.log(
                `Function ${decl.id.name} uses 'this'. Binding 'this' to the function.`
              );
              decl.init.body = t.callExpression(
                t.bindExpression(
                  decl.init.body,
                  t.thisExpression()
                ),
                decl.init.params
              );
            } else {
              console.log(
                `Function ${decl.id.name} does not use 'this'. Skipping binding 'this'.`
              );
            }
          });
        }
        // Otherwise, we can simply convert the const declaration to a function declaration
        else {
          path.node.declarations.forEach((decl) => {
            if (t.isArrowFunctionExpression(decl.init)) {
              console.log(
                `Converting const declaration of function ${decl.id.name} to function declaration.`
              );
              path.replaceWith(
                t.functionDeclaration(
                  decl.id,
                  decl.init.params,
                  decl.init.body
                )
              );
            } else {
              console.log(
                `Declaration of ${decl.id.name} is not an arrow function. Skipping conversion to function declaration.`
              );
            }
          });
        }
      }
    }
  };
};
