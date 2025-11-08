import { toast } from "sonner";

export const handleApiError = async (
  error: unknown,
  fallbackMessage = "Something went wrong",
) => {
  if (error instanceof Response) {
    try {
      const errorData = await error.json();

      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((errorMessage: string) => {
          toast.error(errorMessage);
        });
        return;
      }
    } catch {}
  }

  toast.error(fallbackMessage);
};
