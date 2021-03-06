const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/agent.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/send-mail",
    controller.informToAgent
  );

  app.post(
    "/api/user-details",
    [authJwt.verifyToken],
    controller.createAgent
  );
//   app.put(
//     "/api/updateproduct",
//     [authJwt.verifyToken, authJwt.isAdmin],
//     controller.updateProduct
//   );
//   app.delete(
//     "/api/deleteproduct",
//     [authJwt.verifyToken, authJwt.isAdmin],
//     controller.deleteProduct
//   );
//   app.get(
//     "/api/productlist",
//     controller.allProducts
//   );
//   app.get(
//     "/api/productbyid",
//     controller.productById
//   );
};