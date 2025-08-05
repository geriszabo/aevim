import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import React from "react";
import { FormInputField } from "@/components/Form/FormInputField";
import { useRouter } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { FormPasswordInputField } from "@/components/Form/FormPasswordInputField";
import { useLogin } from "@/hooks/auth/useLogin";
import { FormButton } from "@/components/Form/FormButton";
import { FormDividerText } from "@/components/Form/FormDividerText";
import { LoginSchema, loginSchema } from "@aevim/shared-types/schemas";

export const LoginCard = () => {
  const router = useRouter();
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<LoginSchema>({
    resolver: standardSchemaResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    mutate({ ...data });
  };

  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-heading">
            Welcome Back
          </CardTitle>
          <CardDescription>Time to log your next session</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInputField
              id="email"
              label="Email"
              icon={<Mail className="h-4 w-4 text-muted-foreground" />}
              register={register}
              type="email"
              placeholder="your@email.com bitch"
              error={errors.email}
            />
            <FormPasswordInputField
              id="password"
              label="Password"
              register={register}
              placeholder="••••••••"
              icon
              error={errors.password}
            />
            <FormButton
              loadingText="Logging in..."
              isLoading={isPending}
              disabled={isPending || !isValid}
              type="submit"
            >
              Log in
            </FormButton>
          </form>
          <div className="relative mt-6">
            <FormDividerText text="New to aevim?" />
          </div>

          <Button
            variant="outline"
            className="w-full h-12 text-base mt-4"
            onClick={() => router.push("/signup")}
          >
            CREATE ACCOUNT
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
