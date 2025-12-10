const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const passport = require('passport'); 
const jwt = require('jsonwebtoken');
const config = require("../config/auth.config"); 
const db = require("../models"); 

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }),
    async (req, res) => {
      try {
        const user = req.user; 
        const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 
        });

        const populatedUser = await db.user.findById(user._id).populate("roles", "-__v");
        const authorities = populatedUser.roles.map(role => "ROLE_" + role.name.toUpperCase());

        const redirectUrl = `http://localhost:3000/auth-success?token=${token}&id=${user._id}&username=${encodeURIComponent(user.username)}&email=${encodeURIComponent(user.email)}&roles=${encodeURIComponent(JSON.stringify(authorities))}`;
        res.redirect(redirectUrl);
      } catch (err) {
        res.status(500).send({ message: err.message || "Error during Google auth callback." });
      }
    }
  );
};
