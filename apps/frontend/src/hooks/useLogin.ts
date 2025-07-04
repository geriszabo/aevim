import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { postLogin } from "./api/postLogin";
import { toast } from "sonner";
import { handleApiError } from "@/utils/handleApiError";
import { useAuth } from "@/contexts/AuthContext";

export const useLogin = () => {
  const router = useRouter();
  const { fetchUser } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: postLogin,
    onSuccess: async (response) => {
      const data = await response.json();
      toast.success(data.message);
      await fetchUser();
      queryClient.invalidateQueries();
      router.push("/dashboard");
    },
    onError: (error) =>
      handleApiError(error, "Login failed. Please try again."),
  });
};
