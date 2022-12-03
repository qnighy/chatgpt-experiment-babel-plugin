const t = require("@babel/types");

module.exports = function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        path.node.declarations.forEach((decl) => {
          console.log(`decl:`, decl);
          if (t.isArrowFunctionExpression(decl.init)) {
            console.log(`Found arrow function:`, decl.init);
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
    }
  };
};
