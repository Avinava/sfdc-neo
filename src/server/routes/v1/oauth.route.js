import express from "express";
import jsforce from "jsforce";
import { supabaseAdmin } from "../../services/supabase.js";

function getOauth2(loginUrl) {
  return new jsforce.OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.ORG_REDIRECT_URI,
    loginUrl: loginUrl,
  });
}

const router = express.Router();

router.get("/authorization", (req, res) => {
  const loginUrl = req.query.loginUrl || "https://login.salesforce.com";
  const oauth2 = getOauth2(loginUrl);
  res.redirect(
    oauth2.getAuthorizationUrl({ scope: "api id web", state: { loginUrl } })
  );
});

router.get("/authorization/sandbox", (req, res) => {
  const loginUrl = "https://test.salesforce.com";
  const oauth2 = getOauth2(loginUrl);
  res.redirect(
    oauth2.getAuthorizationUrl({
      scope: "api id web",
      state: JSON.stringify({ loginUrl, production: false }),
    })
  );
});

router.get("/authorization/production", (req, res) => {
  const loginUrl = "https://login.salesforce.com";
  const oauth2 = getOauth2(loginUrl);
  res.redirect(
    oauth2.getAuthorizationUrl({
      scope: "api id web",
      state: JSON.stringify({ loginUrl, production: true }),
    })
  );
});

router.get("/callback", async (req, res) => {
  const loginUrl = req.query.state.loginUrl;
  const oauth2 = getOauth2(loginUrl);
  const conn = new jsforce.Connection({ oauth2 });
  const { code } = req.query;
  await conn.authorize(code);

  const orgInfo = await conn.query("SELECT Id, Name FROM Organization");
  req.session.org = {
    userInfo: conn.userInfo,
    token: {
      instanceUrl: conn.instanceUrl,
      accessToken: conn.accessToken,
      refreshToken: conn.refreshToken,
    },
    ...orgInfo.records[0],
  };

  const { data, error } = await supabaseAdmin.from("salesforce_org").upsert(
    {
      org_id: req.session.org.userInfo.organizationId,
      name: req.session.org.Name,
      user_id: req.session.passport.user._raw.user_id,
      instance_url: conn.instanceUrl,
    },
    { onConflict: "org_id" }
  );

  if (!error) {
    // upsert to ai_user_org
    await supabaseAdmin.from("ai_user_org").upsert(
      {
        user_id: req.session.passport.user._raw.user_id,
        org_id: req.session.org.userInfo.organizationId,
        username: req.session.passport.user._raw.username,
        email: req.session.passport.user._raw.email,
      },
      { onConflict: ["user_id", "org_id"] }
    );

    console.log(res);
  }

  req.session.save(() => {
    res.redirect("/");
  });
});

export default router;
