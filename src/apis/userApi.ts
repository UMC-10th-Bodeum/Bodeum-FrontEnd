import api from "./axios";
import type { ApiResponse } from "./apiTypes";
import reissueTokens from "./reissueTokens";

export type CodeLabel = {
  code: string;
  label: string;
};

export type UserBrief = {
  isLoggedIn: boolean;
  onboardingCompleted: boolean;
  nickname: string | null;
  profileImageUrl: string | null;
  level: number | null;
  badgeName: string | null;
  childDisabilityTypes: CodeLabel[] | null;
  childAge: number | null;
  region: string | null;
};

export type UserProfile = {
  userId: number;
  nickname: string;
  email: string | null;
  provider: string;
  profileImageUrl: string | null;
  point: number;
  level: number;
  badgeName: string;
  levelDescription: string | null;
  childProfile: {
    nickname: string | null;
    birth: string | null;
    disabilityTypes: CodeLabel[];
  } | null;
  keywordText: string | null;
  interestCategories: CodeLabel[];
  regionId: number | null;
  regionLevel1: string | null;
  regionLevel2: string | null;
  guardianNickname: string | null;
  guardianType: string | null;
  communityRoleType: string | null;
  joinedAt: string;
  updatedAt: string;
};

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

export const USER_PROFILE_QUERY_KEY = ["user", "profile"] as const;
export const USER_DASHBOARD_QUERY_KEY = ["user", "dashboard"] as const;
export const USER_SCRAPS_QUERY_KEY = ["user", "scraps"] as const;
export const USER_PROFILE_CHANGED_EVENT = "bodeum:user-profile-changed";

export function notifyUserProfileChanged() {
  window.dispatchEvent(new Event(USER_PROFILE_CHANGED_EVENT));
}

export type DisabilityType =
  | "AUTISM"
  | "INTELLECTUAL_DISABILITY"
  | "CEREBRAL_PALSY"
  | "ADHD"
  | "DEVELOPMENTAL_DELAY"
  | "LANGUAGE_DISORDER"
  | "ETC";

export type InterestCategory =
  | "WELFARE_SUBSIDY"
  | "HOSPITAL_HEALTH"
  | "PARENTING_COMMUNICATION"
  | "GROWTH_EDUCATION";

export type GuardianType = "PARENT" | "GRANDPARENT" | "SIBLING" | "ETC";

export type CommunityRoleType =
  | "INFO_SEEKER"
  | "EXPERIENCE_SHARER"
  | "WISDOM_HELPER";

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

function getSuccessfulResult<T>(response: ApiResponse<T>) {
  if (!response.isSuccess) {
    throw new Error(response.message || "요청을 처리하지 못했습니다.");
  }

  return response.result;
}

async function requestUserBrief() {
  const { data } = await api.get<ApiResponse<UserBrief>>(
    "/api/v1/users/me/brief",
  );

  return getSuccessfulResult(data);
}

export async function getUserBrief() {
  const brief = await requestUserBrief();

  if (brief.isLoggedIn || !localStorage.getItem("refreshToken")) {
    return brief;
  }

  const refreshedTokens = await reissueTokens();

  if (!refreshedTokens) {
    return brief;
  }

  return requestUserBrief();
}

export async function getMyProfile() {
  const { data } = await api.get<ApiResponse<UserProfile>>(
    "/api/v1/users/me/profile",
  );

  return getSuccessfulResult(data);
}

export async function updateMyProfile(request: UpdateMyProfileRequest) {
  const { data } = await api.patch<ApiResponse<UpdateMyProfileResult>>(
    "/api/v1/users/me/profile",
    request,
  );

  const result = getSuccessfulResult(data);

  if (!result.updated) {
    throw new Error("프로필 정보가 수정되지 않았습니다.");
  }

  return result;
}

export async function getMyDashboard() {
  const { data } = await api.get<ApiResponse<UserDashboard>>(
    "/api/v1/users/me/dashboard",
  );

  return getSuccessfulResult(data);
}

export async function getMyPoints() {
  const { data } = await api.get<ApiResponse<UserPoints>>(
    "/api/v1/users/me/points",
  );

  return getSuccessfulResult(data);
}

export async function getMyPosts(page = 0, size = 10) {
  const { data } = await api.get<ApiResponse<MyPostsPage>>(
    "/api/v1/users/me/posts",
    { params: { page, size } },
  );

  return getSuccessfulResult(data);
}

export async function getMyComments(page = 0, size = 10) {
  const { data } = await api.get<ApiResponse<MyCommentsPage>>(
    "/api/v1/users/me/comments",
    { params: { page, size } },
  );

  return getSuccessfulResult(data);
}

export async function getMyScraps(
  page = 0,
  size = 10,
  type?: ScrapType,
) {
  const { data } = await api.get<ApiResponse<MyScrapsPage>>(
    "/api/v1/users/me/scraps",
    { params: { page, size, type } },
  );

  return getSuccessfulResult(data);
}

export async function deleteMyScrap(scrapId: number) {
  const { data } = await api.delete<ApiResponse<unknown> | undefined>(
    `/api/v1/users/me/scraps/${scrapId}`,
  );

  if (data) {
    getSuccessfulResult(data);
  }
}

export async function updateProfileImage(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  const { data } = await api.post<ApiResponse<UserProfile>>(
    "/api/v1/users/me/profile-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return getSuccessfulResult(data);
}

export async function deleteMyAccount() {
  const { data } = await api.delete<ApiResponse<DeleteMyAccountResult>>(
    "/api/v1/users/me",
  );

  return getSuccessfulResult(data);
}
