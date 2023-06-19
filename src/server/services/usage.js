import * as dotenv from "dotenv";
import { supabaseAdmin } from "./supabase.js";

dotenv.config();

class Usage {
  getMetrics = async (userId) => {
    const metrics = {};
    let { data, error } = await supabaseAdmin
      .from("app_usage")
      .select("id, user:salesforce_user(daily_quota)")
      .eq("user", userId)
      .gte("created_at", new Date().toISOString().split("T")[0]);

    // if data is empty
    // query salesforce_user to get quota
    if (data === undefined || data.length == 0) {
      // query all records from salesforce_user
      let { data: userData, error: userError } = await supabaseAdmin
        .from("salesforce_user")
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

  incrementUsage = async (req) => {
    const { data, error } = await supabaseAdmin
      .from("app_usage")
      .insert([{ user: req.session.passport.user.id, path: req.path }]);

    return data;
  };
}

export default new Usage();
