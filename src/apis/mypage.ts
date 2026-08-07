import type {
  DeleteMyAccountResult,
  MyCommentsPage,
  MyPostsPage,
  MyScrapsPage,
  ScrapType,
  UpdateMyProfileRequest,
  UpdateMyProfileResult,
  UserDashboard,
  UserPoints,
} from "@/types/mypage";
import type { UserProfile } from "@/types/user";
import { getSuccessfulResult } from "./apiResponse";
import type { ApiResponse } from "@/types/api";
import api from "./axios";

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

export async function deleteMyPost(postId: number) {
  const { data } = await api.delete<ApiResponse<unknown> | undefined>(
    `/api/v1/community/posts/${postId}`,
  );

  if (data) {
    getSuccessfulResult(data);
  }
}

export async function deleteMyComment(commentId: number) {
  const { data } = await api.delete<ApiResponse<unknown> | undefined>(
    `/api/v1/community/comments/${commentId}`,
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
