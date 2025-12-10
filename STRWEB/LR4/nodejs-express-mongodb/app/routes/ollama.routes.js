const { authJwt } = require("../middleware");
const controller = require("../controllers/ollama.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/ollama/generate",
    [authJwt.verifyToken],
    controller.generateContent
  );

  app.get(
    "/api/ollama/models",
    [authJwt.verifyToken],
    controller.getModels
  );
};