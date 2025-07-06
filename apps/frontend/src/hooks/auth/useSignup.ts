import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { postSignup } from "@/hooks/api/auth/postSignup";

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: postSignup,
    onSuccess: async (data) => {
      toast.success(data.message);
      router.push("/dashboard");
    },
  });
};