import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = parseInt(searchParams.get("limit") ?? "50", 10);
    const limit = Math.min(Math.max(limitParam, 1), 100); // clamp 1-100

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, comment, user_name, user_avatar_url, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase fetch failed:", error);
      return NextResponse.json({ error: "Failed to load reviews." }, { status: 500 });
    }

    return NextResponse.json({ reviews: data });
  } catch (err) {
    console.error("Reviews fetch failed:", err);
    return NextResponse.json({ error: "Failed to load reviews." }, { status: 500 });
  }
}
