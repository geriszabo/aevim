import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { postSignup } from '@/hooks/api/postSignup';
import { handleApiError } from '@/utils/handleApiError';

export const useSignup = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: postSignup,
    onSuccess: async (response) => {
      const data = await response.json();
      toast.success(data.message);
      router.push('/dashboard');
    },
    onError: (error) => handleApiError(error),
  });
};