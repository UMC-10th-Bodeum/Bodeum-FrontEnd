import type {
  CodeLabel,
  CommunityRoleType,
  DisabilityType,
  GuardianType,
  InterestCategory,
  UserProfile,
} from "./user";
import type { DiagnosisType } from "./diagnosis";

export type UserDashboard = {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  point: number;
  level: number;
  badgeName: string;
  levelDescription: string | null;
  childProfile: UserProfile["childProfile"];
  keywordText: string | null;
  interestCategories: CodeLabel[];
  regionId: number | null;
  regionLevel1: string | null;
  regionLevel2: string | null;
  guardianNickname: string | null;
  guardianType: string | null;
  communityRoleType: string | null;
  activitySummary: {
    savedInfoCount: number;
    myPostCount: number;
    myCommentCount: number;
  };
};

export type UpdateMyProfileRequest = {
  nickname?: string;
  childNickname?: string;
  childBirth?: string;
  disabilityTypes?: DisabilityType[];
  keywordText?: string;
  interestCategories?: InterestCategory[];
  regionId?: number;
  guardianType?: GuardianType;
  communityRoleType?: CommunityRoleType;
};

export type UpdateMyProfileResult = {
  updated: boolean;
};

export type DeleteMyAccountResult = {
  success: boolean;
};

export type MyPost = {
  postId: number;
  boardType: string;
  anonymityType: string;
  title: string;
  content: string;
  isQuestion: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  scrapCount: number;
  createdAt: string;
  updatedAt: string;
};

export type MyPostsPage = {
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  posts: MyPost[];
};

export type MyComment = {
  commentId: number;
  parentCommentId: number | null;
  content: string;
  isAccepted: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  postId: number;
  postBoardType: string;
  postTitle: string;
};

export type MyCommentsPage = {
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  comments: MyComment[];
};

export type ScrapType = "INFO" | "NEWS" | "POST";

export type InfoScrap = {
  scrapId: number;
  infoItemId: number;
  mainCategory: string;
  mainCategoryKo: string;
  subCategory: string;
  subCategoryKo: string;
  name: string;
  introduction: string;
  address: string;
  sido: string;
  sigungu: string;
  phone: string;
  homepageUrl: string;
  scrappedAt: string;
};

export type NewsScrap = {
  scrapId: number;
  newsId: number;
  title: string;
  summary: string;
  sourceName: string;
  originalUrl: string;
  thumbnailUrl: string;
  newsType: string;
  categoryCode: string;
  categoryLabel: string;
  recruitmentStatus: string;
  publishedAt: string;
  scrappedAt: string;
};

export type PostScrap = MyPost & {
  scrapId: number;
  scrappedAt: string;
};

export type MyScrapsPage = {
  totalCount: number;
  infoScraps: InfoScrap[];
  newsScraps: NewsScrap[];
  postScraps: PostScrap[];
};

export type UserPointActivity = {
  pointType: string;
  label: string;
  pointPerAction: number;
  earnedPoint: number;
  activityCount: number;
};

export type UserPoints = {
  totalPoint: number;
  activities: UserPointActivity[];
};

export type MyPageTabKey = "saved" | "posts" | "comments";

interface MyPageItemBase {
  id: number | string;
  postId: number;
  date: string;
}

export interface MyPageScrapItem extends MyPageItemBase {
  type: "scrap";
  scrapId: number;
  scrapType: ScrapType;
  title: string;
  targetPath?: string;
  sourceLabel?: string;
  dDay?: string;
}

export interface MyPagePostItem extends MyPageItemBase {
  id: number;
  type: "post";
  title: string;
}

export interface MyPageCommentItem extends MyPageItemBase {
  id: number;
  type: "comment";
  comment: string;
  postTitle?: string;
}

export type MyPageItem =
  | MyPageScrapItem
  | MyPagePostItem
  | MyPageCommentItem;

export interface MyPageTab {
  key: MyPageTabKey;
  label: string;
}

export interface ProfileSettingsForm {
  profileImageUrl: string | null;
  profileImageFile: File | null;
  parentNickname: string;
  region: string;
  district: string;
  childNickname: string;
  birthYear: string;
  birthMonth: string;
  diagnoses: DiagnosisType[];
  interests: InterestCategory[];
}
