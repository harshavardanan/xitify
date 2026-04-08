const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();

function normalizeUser(profile, provider) {
  let normalized = {
    id: profile.id,
    provider,
    name: {
      givenName: "",
      familyName: "",
      fullName: "",
    },
    email: "",
    photo: "",
  };

  switch (provider) {
    case "google":
      normalized.name.givenName =
        profile.given_name || profile.name?.givenName || "";
      normalized.name.familyName =
        profile.family_name || profile.name?.familyName || "";
      normalized.name.fullName =
        profile.displayName || profile.name?.givenName || "";
      normalized.email = profile.email;
      normalized.photo = profile.picture || profile.photos?.[0]?.value || "";
      break;

    case "github":
      normalized.name.givenName = profile.username || "";
      normalized.name.fullName = profile.displayName || profile.username || "";
      normalized.email = profile.emails?.[0]?.value || "";
      normalized.photo = profile.photos?.[0]?.value || "";
      break;

    case "microsoft":
      normalized.name.givenName = profile.name?.givenName || "";
      normalized.name.familyName = profile.name?.familyName || "";
      normalized.name.fullName = profile.displayName || "";
      normalized.email =
        profile._json.mail ||
        profile._json.userPrincipalName ||
        profile.emails?.[0]?.value ||
        "";
      normalized.photo = "/default-avatar.png"; // Microsoft Graph API needs extra permissions for photo
      break;
  }

  return normalized;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/google/callback",
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, done) {
      const normalized = normalizeUser(profile, "google");
      return done(null, normalized);
    }
  )
);

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/microsoft/callback",
      scope: ["user.read"],
    },
    function (accessToken, refreshToken, profile, done) {
      const normalized = normalizeUser(profile, "microsoft");
      return done(null, normalized);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/github/callback",
      scope: ["user:email"],
    },
    function (accessToken, refreshToken, profile, done) {
      const normalized = normalizeUser(profile, "github");
      return done(null, normalized);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

const generateToken = (profile) => {
  return jwt.sign(
    {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      photo: profile.photo,
      provider: profile.provider,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = { passport, generateToken };
