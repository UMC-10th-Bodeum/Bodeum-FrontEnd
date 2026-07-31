import type { CommunityPost } from "@/types/community";

const firstCommunityPost: Omit<CommunityPost, "id"> = {
  category: "GROWTH_RECORD",
  diagnosis: "AUTISM",
  author: "익명 부모님",
  createdAt: "2시간 전",
  title: "ABA 치료 6개월째, 드디어 눈맞춤이 됐어요 😭",
  content:
    "처음엔 정말 막막했는데 여기 선배 부모님들 덕분에 ABA 치료사와 연결하고 꾸준히 했더니 드디어 반응이 생겼습니다.",
  likes: 142,
  comments: 38,
  views: 1204,
  imageCount: 3,
};

export const communityPosts: CommunityPost[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: index + 1,
    ...firstCommunityPost,
  }),
);
