export interface Post {
  id: number;
  title: string;
  region: string;
  likes: number;
  talks?: number;
  views: number;
}

export const postList: Post[] = [
  {
    id: 1,
    title: "언어치료 프로그램 이용자 모집",
    region: "부산 수영구",
    likes: 142,
    talks: 38,
    views: 1204,
  },
  {
    id: 2,
    title: "놀이치료 참여 아동 모집",
    region: "서울 강남구",
    likes: 89,
    talks: 38,
    views: 950,
  },
  {
    id: 3,
    title: "감각통합치료 설명회 개최",
    region: "경기 성남시",
    likes: 67,
    views: 581,
  },
];