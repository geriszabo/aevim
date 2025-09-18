import { toast } from "sonner";

export const handleApiError = async (
  error: unknown,
  fallbackMessage = "Something went wrong"
) => {
  if (error instanceof Response) {
    try {
      //For the suspense component to not throw an error in the browser
      const clonedResponse = error.clone();
      const errorData = await clonedResponse.json();

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