import passport from "passport";
import ForceDotComStrategy from "passport-forcedotcom";

console.log([process.env.SF_AUTHORIZATION_URL]);

passport.use(
  new ForceDotComStrategy.Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      scope: ["id", "chatter_api"],
      callbackURL: `/api/v1/rsm-auth/callback`,
      authorizationURL: process.env.SF_AUTHORIZATION_URL,
    },
    function verify(token, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.use(
  "community",
  new ForceDotComStrategy.Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      scope: ["id", "chatter_api"],
      callbackURL: `/api/v1/rsm-auth/callback`,
      authorizationURL: process.env.COMMUNITY_AUTHORIZATION_URL,
    },
    function verify(token, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

export default passport;
