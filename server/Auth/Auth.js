const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ENDPOINT } = require("../../client/src/App");

router.get("/login", function (req, res, next) {
  res.render("login");
});

//Google Auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", passport.authenticate("google"), (req, res) =>
  res.redirect(`${process.env.ENDPOINT}`)
);

router.get(
  "/microsoft",
  passport.authenticate("microsoft", {
    prompt: "select_account",
    scope: ["user.read"],
  })
);
router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(process.env.ENDPOINT);
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(process.env.ENDPOINT);
  }
);

module.exports = router;
