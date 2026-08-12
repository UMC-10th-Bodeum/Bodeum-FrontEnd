import { createContext, useContext } from "react";

import type { CommunityComment } from "@/types/community";

export interface CommunityCommentsContextValue {
  canAdopt: boolean;
  replyTargetId: number | null;
  isReplyPending: boolean;
  likingCommentId?: number;
  isAdoptPending: boolean;
  updatingCommentId?: number;
  onSelectReplyTarget: (comment: CommunityComment) => void;
  onCancelReply: () => void;
  onSubmitReply: (parentCommentId: number, content: string) => void;
  onLike: (commentId: number, isCurrentlyLiked: boolean) => void;
  onAdopt: (commentId: number, isAccepted: boolean) => void;
  onDelete: (commentId: number) => void;
  onUpdate: (commentId: number, content: string, onSuccess: () => void) => void;
}

export const CommunityCommentsContext = createContext<CommunityCommentsContextValue | null>(null);

export function useCommunityCommentsContext() {
  const context = useContext(CommunityCommentsContext);

  if (!context) {
    throw new Error("useCommunityCommentsContext must be used within CommunityCommentsContext");
  }

  return context;
}
