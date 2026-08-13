import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteMyAccount,
  deleteMyComment,
  deleteMyPost,
  deleteMyPostScrap,
  deleteMyScrap,
  getMyComments,
  getMyDashboard,
  getMyPoints,
  getMyPosts,
  getMyScraps,
  updateMyProfile,
  updateProfileImage,
} from "@/apis/mypageApi";
import { getMyProfile } from "@/apis/userApi";
import { queryKeys } from "@/queries/queryKeys";

export const USER_PROFILE_QUERY_KEY = queryKeys.user.profile;
export const USER_DASHBOARD_QUERY_KEY = ["user", "dashboard"] as const;
export const USER_SCRAPS_QUERY_KEY = ["user", "scraps"] as const;
export const USER_POSTS_QUERY_KEY = ["user", "posts"] as const;
export const USER_COMMENTS_QUERY_KEY = ["user", "comments"] as const;
export const USER_POINTS_QUERY_KEY = ["user", "points"] as const;

export const myProfileQueryOptions = queryOptions({
  queryKey: USER_PROFILE_QUERY_KEY,
  queryFn: getMyProfile,
  retry: false,
});

export const myPointsQueryOptions = queryOptions({
  queryKey: USER_POINTS_QUERY_KEY,
  queryFn: getMyPoints,
  retry: false,
});

export const useMyProfile = (enabled = true) => {
  return useQuery({
    ...myProfileQueryOptions,
    enabled,
  });
};

export const useMyDashboard = () => {
  return useQuery({
    queryKey: USER_DASHBOARD_QUERY_KEY,
    queryFn: getMyDashboard,
    retry: false,
  });
};

export const useMyPoints = () => {
  return useQuery(myPointsQueryOptions);
};

export const useMyScraps = (
  page: number,
  size: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [...USER_SCRAPS_QUERY_KEY, page, size],
    queryFn: () => getMyScraps(page, size),
    enabled,
    retry: false,
  });
};

export const useMyPosts = (
  page: number,
  size: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [...USER_POSTS_QUERY_KEY, page, size],
    queryFn: () => getMyPosts(page, size),
    enabled,
    retry: false,
  });
};

export const useMyComments = (
  page: number,
  size: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [...USER_COMMENTS_QUERY_KEY, page, size],
    queryFn: () => getMyComments(page, size),
    enabled,
    retry: false,
  });
};

export const useUpdateMyProfile = () => {
  return useMutation({
    mutationFn: updateMyProfile,
  });
};

export const useUpdateProfileImage = () => {
  return useMutation({
    mutationFn: updateProfileImage,
  });
};

export const useDeleteMyScrap = () => {
  return useMutation({
    mutationFn: deleteMyScrap,
  });
};

export const useDeleteMyPostScrap = () => {
  return useMutation({
    mutationFn: deleteMyPostScrap,
  });
};

export const useDeleteMyPost = () => {
  return useMutation({
    mutationFn: deleteMyPost,
  });
};

export const useDeleteMyComment = () => {
  return useMutation({
    mutationFn: deleteMyComment,
  });
};

export const useDeleteMyAccount = () => {
  return useMutation({
    mutationFn: deleteMyAccount,
  });
};
