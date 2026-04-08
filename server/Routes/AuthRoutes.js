const express = require("express");
const passport = require("passport");
const { generateToken } = require("../Auth/Passport");
require("dotenv").config();

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.ENDPOINT}/signin`,
  }),
  (req, res) => {
    res.redirect(`${process.env.ENDPOINT}/auth-success`);
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.ENDPOINT}/signin`,
  }),
  (req, res) => {
    res.redirect(`${process.env.ENDPOINT}/auth-success`);
  }
);

router.get(
  "/microsoft",
  passport.authenticate("microsoft", {
    scope: ["user.read"],
    prompt: "select_account",
  })
);

router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", {
    failureRedirect: `${process.env.ENDPOINT}/signin`,
  }),
  (req, res) => {
    res.redirect(`${process.env.ENDPOINT}/auth-success`);
  }
);

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).send("Logout failed");
    }
    req.session.destroy(() => {
      res.clearCookie("token");
      res.clearCookie("connect.sid");
      res.redirect(`${process.env.ENDPOINT}`);
    });
  });
});

module.exports = router;
