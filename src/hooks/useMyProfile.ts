import { getMyProfile } from "@/apis/userApi";
import { useQuery } from "@tanstack/react-query";

export function useMyProfileQuery() {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 10,
  });
}