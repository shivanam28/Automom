import { z } from "zod";

export const meetingMinutesSchema = z.object({
  meeting_title: z.string().min(1),
  meeting_datetime: z.string(), // may be "" if not mentioned in transcript
  summary: z.string().min(1),
  decisions: z.array(z.string()),
  action_items: z.array(z.string()),
  keywords: z.array(z.string()),
});

export type MeetingMinutes = z.infer<typeof meetingMinutesSchema>;
