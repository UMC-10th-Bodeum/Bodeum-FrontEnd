import type { ActivityPointStat, MyPageItem, MyPageTab, MyPageTabKey } from "../types";

export const initialMyPageItems: Record<MyPageTabKey, MyPageItem[]> = {
  saved: Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    postId: index + 1,
    type: "scrap" as const,
    title: "ABA 치료 6개월째, 드디어 눈맞춤이 됐어요",
    date: "2026.04.25",
    dDay: index === 0 ? "D-Day" : undefined,
  })),
  posts: Array.from({ length: 4 }, (_, index) => ({
    id: index + 101,
    postId: index + 1,
    type: "post" as const,
    title: "아이와 함께한 작은 변화의 기록",
    date: `2026.04.${24 - index}`,
  })),
  comments: Array.from({ length: 5 }, (_, index) => ({
    id: index + 201,
    postId: index + 1,
    type: "comment" as const,
    comment: "저도 비슷한 경험이 있어요. 함께 힘내요!",
    date: `2026.04.${23 - index}`,
  })),
};

export const myPageTabs: MyPageTab[] = [
  { key: "saved", label: "저장한 정보" },
  { key: "posts", label: "내 게시글" },
  { key: "comments", label: "내가 단 댓글" },
];

export const initialMyPageCounts: Record<MyPageTabKey, number> = {
  saved: 24,
  posts: 24,
  comments: 24,
};

export const initialActivityPointStats: ActivityPointStat[] = [
  { id: "post", label: "게시글 작성", pointsPerAction: 5, count: 24 },
  { id: "answer", label: "답변 작성", pointsPerAction: 4, count: 18 },
  { id: "helpful", label: "도움돼요", pointsPerAction: 5, count: 12 },
  { id: "accepted", label: "답변 채택", pointsPerAction: 20, count: 3 },
];
