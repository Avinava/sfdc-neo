import * as dotenv from "dotenv";
import passport from "passport";
import { Strategy as ForceDotComStrategy } from "passport-forcedotcom";
import { supabaseAdmin } from "./supabase.js";
import jsforce from "jsforce";
dotenv.config();

passport.use(
  new ForceDotComStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      scope: ["id", "chatter_api", "api"],
      callbackURL: `/api/v1/auth/callback`,
      authorizationURL: process.env.PRODUCTION_AUTHORIZATION_URL,
      tokenURL: process.env.PRODUCTION_TOKEN_URL,
    },
    async function verify(token, refreshToken, profile, done) {
      profile.org = await getOrganization(token)
      profile.oauth = {
        refreshToken,
        accessToken: token
      };
      return done(null, profile);
    }
  )
);

passport.use(
  "forcedotcom-sandbox",
  new ForceDotComStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      scope: ["id", "chatter_api", "api"],
      callbackURL: `/api/v1/auth/callback-sandbox`,
      authorizationURL: process.env.SANDBOX_AUTHORIZATION_URL,
      tokenURL: process.env.SANDBOX_TOKEN_URL,
    },
    async function verify(token, refreshToken, profile, done) {
      profile.org = await getOrganization(token)
      profile.oauth = {
        refreshToken,
        accessToken: token
      };
      return done(null, profile);
    }
  )
);

passport.serializeUser(async function (user, done) {
  const instanceUrl = user._raw.urls.rest.split("/services/data")[0];
  const supaUser = {
    user_id: user.id,
    username: user._raw.username,
    organization_id: user._raw.organization_id,
    username: user._raw.username,
    email: user._raw.email,
    name: user.displayName,
    instance_url: instanceUrl,
  };

  if (process.env.ENABLE_QUOTA === "true") {
    // upsert using user_id to supabase
    const { data, error } = await supabaseAdmin
      .from("salesforce_user")
      .upsert(supaUser, { onConflict: "user_id" });
  }

  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

async function getOrganization(token) {
  const connection = new jsforce.Connection({
    instanceUrl: token.params.instance_url,
    accessToken: token.params.access_token,
  });
  const result = await connection.query('SELECT Id, Name, OrganizationType, NamespacePrefix, InstanceName FROM Organization')
  return result.records[0]
}

export default passport;
