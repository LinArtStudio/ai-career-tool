export const FREE_LIMITS = {
  resume: { daily: 3, monthly: 20 },
  interview: { daily: 3, monthly: 20 },
  career: { daily: 1, monthly: 5 },
} as const;

export type Feature = keyof typeof FREE_LIMITS;

export async function checkUsageLimit(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  userId: string,
  feature: Feature
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const today = new Date().toISOString().split("T")[0];

  const { count } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("feature", feature)
    .gte("created_at", `${today}T00:00:00`);

  const limit = FREE_LIMITS[feature].daily;
  const used = count || 0;

  return {
    allowed: used < limit,
    remaining: Math.max(0, limit - used),
    limit,
  };
}

export async function isPaidUser(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("user_profiles")
    .select("plan, plan_expires_at")
    .eq("id", userId)
    .single();

  if (!data) return false;
  if (data.plan === "free") return false;
  if (data.plan_expires_at && new Date(data.plan_expires_at) < new Date()) return false;
  return true;
}

export async function recordUsage(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  userId: string,
  feature: Feature,
  tokensUsed: number = 0
) {
  await supabase.from("usage_logs").insert({
    user_id: userId,
    feature,
    tokens_used: tokensUsed,
  });
}
