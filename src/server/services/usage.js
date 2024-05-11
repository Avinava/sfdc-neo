import * as dotenv from "dotenv";
import { supabaseAdmin } from "./supabase.js";

dotenv.config();

class Usage {
  getMetrics = async (userId) => {
    const metrics = {};
    let { data, error } = await supabaseAdmin
      .from("ai_usage")
      .select("id, user:ai_user(daily_quota)")
      .eq("user", userId)
      .gte("created_at", new Date().toISOString().split("T")[0]);

    // if data is empty
    // query ai_user to get quota
    if (data === undefined || data.length == 0) {
      // query all records from ai_user
      let { data: userData, error: userError } = await supabaseAdmin
        .from("ai_user")
        .select("id, daily_quota")
        .eq("user_id", userId);

      userData = Array.isArray(userData) ? userData[0] : userData;

      metrics.dailyQuota = userData.daily_quota;
      metrics.remainingQuota = metrics.dailyQuota;
    } else {
      const salesforce_org = Array.isArray(data) ? data[0] : data;
      metrics.dailyQuota = salesforce_org.user.daily_quota;
      metrics.remainingQuota = metrics.dailyQuota - data.length;
    }

    return metrics;
  };

  incrementUsage = async (req, res) => {
    const org = req.session?.org;
    const { data, error } = await supabaseAdmin.from("ai_usage").upsert(
      {
        user_id: org.userInfo.id,
        path: req.path,
        org_id: org.Id,
        path: req.path,
        payload: req.body,
        request_id: req.id,
        response: res.body,
      },
      { onConflict: "request_id" }
    );

    return data;
  };
}

export default new Usage();
