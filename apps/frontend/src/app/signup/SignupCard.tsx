import { FormButton } from "@/components/Form/FormButton";
import { FormDividerText } from "@/components/Form/FormDividerText";
import { FormInputField } from "@/components/Form/FormInputField";
import { FormPasswordInputField } from "@/components/Form/FormPasswordInputField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useSignup } from "@/hooks/auth/useSignup";
import { SignupFormData, signupSchema } from "@/schemas/signup-schema";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

export const SignupCard = () => {
  const router = useRouter();
  const { mutate, isPending } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<SignupFormData>({
    resolver: standardSchemaResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      confirmPassword: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    const { email, password, username } = data;
    mutate({ email, password, username });
  };
  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-heading">
            Join the Movement
          </CardTitle>
          <CardDescription>Start logging with power</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInputField
              id="username"
              label="Username"
              register={register}
              type="text"
              autoComplete="username"
              autoFocus
              placeholder="Your username"
              error={errors.username}
            />
            <FormInputField
              id="email"
              label="Email"
              register={register}
              type="text"
              autoComplete="email"
              autoFocus
              placeholder="Your email"
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
            <FormPasswordInputField
              id="confirmPassword"
              label="Confirm Password"
              register={register}
              placeholder="••••••••"
              icon
              error={errors.confirmPassword}
            />
            <FormButton
              type="submit"
              disabled={!isValid}
              isLoading={isPending}
              loadingText="Creating Account..."
            >
              Start logging
            </FormButton>
          </form>
          <div className="relative mt-6">
            <FormDividerText text="Already crushing it?" />
          </div>
          <Button
            variant="outline"
            className="w-full h-12 text-base mt-4"
            onClick={() => router.push("/login")}
          >
            LOG IN
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
