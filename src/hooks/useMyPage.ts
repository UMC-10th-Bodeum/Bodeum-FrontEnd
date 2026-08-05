import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteMyAccount,
  deleteMyScrap,
  getMyComments,
  getMyDashboard,
  getMyPoints,
  getMyPosts,
  getMyScraps,
  updateMyProfile,
  updateProfileImage,
} from "@/apis/mypage";
import { getRegions } from "@/apis/onboardingApi";
import { getMyProfile } from "@/apis/userApi";

export const USER_PROFILE_QUERY_KEY = ["user", "profile"] as const;
export const USER_DASHBOARD_QUERY_KEY = ["user", "dashboard"] as const;
export const USER_SCRAPS_QUERY_KEY = ["user", "scraps"] as const;

export const myProfileQueryOptions = queryOptions({
  queryKey: USER_PROFILE_QUERY_KEY,
  queryFn: getMyProfile,
  retry: false,
});

export const myPageRegionsQueryOptions = queryOptions({
  queryKey: ["regions"],
  queryFn: getRegions,
  retry: false,
});

export const useMyProfile = () => {
  return useQuery(myProfileQueryOptions);
};

export const useMyDashboard = () => {
  return useQuery({
    queryKey: USER_DASHBOARD_QUERY_KEY,
    queryFn: getMyDashboard,
    retry: false,
  });
};

export const useMyPoints = () => {
  return useQuery({
    queryKey: ["user", "points"],
    queryFn: getMyPoints,
    retry: false,
  });
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
    queryKey: ["user", "posts", page, size],
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
    queryKey: ["user", "comments", page, size],
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

export const useDeleteMyAccount = () => {
  return useMutation({
    mutationFn: deleteMyAccount,
  });
};
