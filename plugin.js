const t = require("@babel/types");

module.exports = function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        // If the original arrow function uses this, we bind the correct this value to the function
        if (path.node.id && path.node.id.name === "this") {
          console.log(`Converting const declaration of function with name '${path.node.id.name}' to bound function expression.`);
          path.node.declarations.forEach((decl) => {
            if (t.isArrowFunctionExpression(decl.init)) {
              // Transform the arrow function body into a call expression with the bind expression as the callee
              decl.init.body = t.callExpression(
                t.bindExpression(
                  decl.init.body,
                  t.thisExpression()
                ),
                // Pass the original function arguments to the call expression
                decl.init.params
              );
            }
          });
        }
        // Otherwise, we can simply convert the const declaration to a function declaration
        else {
          // Use the name of the identifier if it exists, otherwise use a default string
          const identifierName = path.node.id ? path.node.id.name : "anonymous";
          console.log(`Converting const declaration of function with name '${identifierName}' to function declaration.`);

          // Convert the const declaration to a function declaration
          path.replaceWith(
            t.functionDeclaration(
              // Use the original identifier if it exists, otherwise use a default name
              path.node.id || t.identifier("anonymous"),
              // Use the original function parameters if they exist, otherwise use an empty array
              decl.init.params || [],
              // Use the original function body if it exists, otherwise use an empty block statement
              decl.init.body || t.blockStatement([])
            )
          );
        }
      }
    }
  };
};
