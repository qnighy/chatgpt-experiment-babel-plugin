const t = require("@babel/types");

module.exports = function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        // If the original arrow function uses this, we bind the correct this value to the function
        if (path.node.id && path.node.id.name === "this") {
          path.node.declarations.forEach((decl) => {
            if (t.isArrowFunctionExpression(decl.init)) {
              decl.init.body = t.callExpression(
                t.bindExpression(
                  decl.init.body,
                  t.thisExpression()
                ),
                decl.init.params
              );
            }
          });
        }
        // Otherwise, we can simply convert the const declaration to a function declaration
        else {
          path.node.declarations.forEach((decl) => {
            if (t.isArrowFunctionExpression(decl.init)) {
              path.replaceWith(
                t.functionDeclaration(
                  decl.id,
                  decl.init.params,
                  decl.init.body
                )
              );
            }
          });
        }
      },
    },
  };
};
