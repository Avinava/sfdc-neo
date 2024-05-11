import passport from "passport";
import ForceDotComStrategy from "passport-forcedotcom";
import { supabaseAdmin } from "../supabase.js";

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

passport.serializeUser(async function (user, done) {
  const supaUser = {
    user_id: user._raw.user_id,
    username: user._raw.username,
    org_id: user._raw.organization_id,
    username: user._raw.username,
    email: user._raw.email,
    name: user.displayName,
  };
  const { data, error } = await supabaseAdmin
    .from("ai_user")
    .upsert(supaUser, { onConflict: "user_id" });

  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

export default passport;
