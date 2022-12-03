const t = require("@babel/types");

module.exports = function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        path.node.declarations.forEach((decl) => {
          if (t.isArrowFunctionExpression(decl.init)) {
            // If the original arrow function uses this, we bind the correct this value to the function
            if (t.isThisExpression(decl.init.body)) {
              path.replaceWith(
                t.variableDeclaration("const", [
                  t.variableDeclarator(
                    decl.id,
                    t.callExpression(
                      t.bindExpression(decl.init.body, t.thisExpression()),
                      decl.init.params
                    )
                  ),
                ])
              );
            }
            // Otherwise, we can simply convert the const declaration to a function declaration
            else {
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
      },
    },
  };
};
