import { useQuery } from "@tanstack/react-query";
import { ApiError, GetUserBiometricsResponse } from "@/types/api";
import { getUserBiometrics } from "../api/userBiometrics/getUserBiometrics";

export const useGetUserBiometrics = () => {
  return useQuery<GetUserBiometricsResponse, ApiError>({
    queryKey: ["userBiometrics"],
    queryFn: () => getUserBiometrics(),
    retry: 1,
  });
};
