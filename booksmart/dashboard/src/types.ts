export interface StatsResponse {
  northStar: {
    emailsSentToday: { current: number; max: number };
    positiveReplies: number;
    replyRate: number;
    replyRateChange: number;
    callsBooked: number;
  };
  momentum: {
    conceptRequests: number;
    conceptsDelivered: number;
    testimonialsReceived: number;
    pipelineValue: number;
  };
  pipeline: { id: string; label: string; count: number; conversion: number | null }[];
  todayQueue: { qualifiedReady: number; scheduledToday: number; remainingCapacity: number };
  campaignHealth: { sentToday: number; opens: number; openRate: number; replyRate: number; bounceRate: number; openedLeads: { leadId: string; name: string; email: string; stepOrder: number; openedAt: string }[] };
  topNiche: { name: string; leads: number; replyRate: number; conceptRequests: number; callsBooked: number } | null;
  sequences: { id: string; name: string; active: boolean; steps: number; enrolled: number }[];
  leads: { total: number; byStatus: Record<string, number> };
}

export interface ActivityEvent {
  id: string;
  lead_name: string;
  lead_email: string;
  type: string;
  subject: string | null;
  stepOrder: number | null;
  createdAt: string;
  kind: "email" | "lead";
  note?: string | null;
}

export interface RecentResponse {
  events: ActivityEvent[];
}
