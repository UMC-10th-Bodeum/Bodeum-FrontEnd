export const queryKeys = {
  user: {
    all: ["user"] as const,
    brief: ["user", "brief"] as const,
    profile: ["user", "profile"] as const,
  },
  onboarding: {
    all: ["onboarding"] as const,
    status: ["onboarding", "status"] as const,
    resume: ["onboarding", "resume"] as const,
    regions: ["onboarding", "regions"] as const,
  },
  aiChat: {
    all: ["aiChat"] as const,
    terms: ["aiChat", "terms"] as const,
    room: ["aiChat", "room"] as const,
    starter: ["aiChat", "starter"] as const,
    todayMessages: ["aiChat", "messages", "today"] as const,
    history: ["aiChat", "messages", "history"] as const,
  },
} as const;
