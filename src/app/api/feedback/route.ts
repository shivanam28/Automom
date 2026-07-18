import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { feedbackSchema } from "@/types/feedback";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid feedback data." },
        { status: 400 }
      );
    }

    // If signed in, attach the real name + avatar so it displays properly
    // on the public reviews page. Anonymous submissions leave these null,
    // and the reviews page renders those as "Anonymous" with a fallback icon.
    const user = await currentUser();
    const userName = user
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Automom User"
      : null;
    const userAvatarUrl = user?.imageUrl ?? null;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("reviews").insert({
      rating: parsed.data.rating,
      comment: parsed.data.comment ?? null,
      meeting_title: parsed.data.meetingTitle ?? null,
      user_name: userName,
      user_avatar_url: userAvatarUrl,
    });

    if (error) {
      console.error("Supabase insert failed:", error);
      return NextResponse.json(
        { error: "Failed to save feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback submission failed:", err);
    return NextResponse.json(
      { error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
