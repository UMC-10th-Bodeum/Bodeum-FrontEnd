import type { CommunityComment } from "@/types/community";

export const communityCommentMocks: CommunityComment[] = [
  {
    id: 1,
    author: "봄날의 엄마",
    createdAt: "2시간 전",
    content:
      "진심으로 축하드려요! 그 감동이 얼마나 클지 저도 기억이 납니다. 6개월 동안 정말 수고 많으셨어요. 앞으로도 꾸준히 하시면 더 많은 변화가 올 거예요 💙",
    likes: 142,
  },
  {
    id: 2,
    author: "봄날의 엄마",
    createdAt: "2시간 전",
    content:
      "진심으로 축하드려요! 그 감동이 얼마나 클지 저도 기억이 납니다. 6개월 동안 정말 수고 많으셨어요. 앞으로도 꾸준히 하시면 더 많은 변화가 올 거예요 💙",
    likes: 142,
  },
  {
    id: 3,
    author: "봄날의 엄마",
    createdAt: "2시간 전",
    content:
      "진심으로 축하드려요! 그 감동이 얼마나 클지 저도 기억이 납니다. 6개월 동안 정말 수고 많으셨어요. 앞으로도 꾸준히 하시면 더 많은 변화가 올 거예요 💙",
    likes: 142,
    replies: [
      {
        id: 4,
        author: "민준맘",
        createdAt: "2시간 전",
        content: "정말 수고 많으셨습니다!",
        likes: 142,
      },
    ],
  },
];
