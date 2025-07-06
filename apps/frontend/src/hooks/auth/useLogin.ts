import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { postLogin } from "../api/auth/postLogin";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useLogin = () => {
  const router = useRouter();
  const { fetchUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLogin,
    onSuccess: async (data) => {
      toast.success(data.message);
      await fetchUser();
      queryClient.invalidateQueries();
      router.push("/dashboard");
    },
  });
};
