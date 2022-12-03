const t = require("@babel/types");

module.exports = function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        path.node.declarations.forEach((decl) => {
          if (t.isArrowFunctionExpression(decl.init)) {
            // Check if the original arrow function uses `this` in its body
            if (t.isThisExpression(decl.init.body)) {
              console.log(`Converting const declaration of function with name '${decl.id.name}' to bound function expression.`);
              decl.init.body = t.callExpression(
                t.bindExpression(
                  decl.init.body,
                  t.thisExpression()
                ),
                decl.init.params
              );
            } else {
              console.log(`Converting const declaration of function with name '${decl.id.name}' to function declaration.`);
              path.replaceWith(
                t.functionDeclaration(
                  decl.id,
                  decl.init.params,
                  decl.init.body
                )
              );
            }
          }
        });
      }
    }
  };
};
