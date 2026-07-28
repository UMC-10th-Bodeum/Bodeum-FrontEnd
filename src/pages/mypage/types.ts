export type MyPageTabKey = "saved" | "posts" | "comments";

interface MyPageItemBase {
  id: number;
  postId: number;
  date: string;
}

export interface MyPageScrapItem extends MyPageItemBase {
  type: "scrap";
  title: string;
  dDay?: string;
}

export interface MyPagePostItem extends MyPageItemBase {
  type: "post";
  title: string;
}

export interface MyPageCommentItem extends MyPageItemBase {
  type: "comment";
  comment: string;
}

export type MyPageItem =
  | MyPageScrapItem
  | MyPagePostItem
  | MyPageCommentItem;

export interface MyPageTab {
  key: MyPageTabKey;
  label: string;
}
