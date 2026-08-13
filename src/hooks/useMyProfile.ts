import { getMyProfile } from "@/apis/userApi";
import { queryKeys } from "@/queries/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useMyProfileQuery() {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 10,
  });
}
