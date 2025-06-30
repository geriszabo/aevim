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
import { postSignup } from "@/hooks/api/postSignup";
import { SignupFormData, signupSchema } from "@/schemas/signup-schema";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

export const SignupCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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

  const onSubmit = async (data: SignupFormData) => {
    const { email, password, username } = data;
    setIsLoading(true);
    console.log(data)
    try {
      const res = await postSignup({ email, password, username });
      if (res.ok) {
        const { message } = await res.json();
        toast.success(message);
        router.push("/dashboard");
      } else {
        const { errors } = await res.json();
        toast.error(errors);
      }
    } catch (error) {
      console.log("Couldt not signup", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-heading">
            Join the Movement
          </CardTitle>
          <CardDescription>Start logging with power</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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
            {/* TODO: extract this button */}
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading || !isValid}
              className="w-full h-12 text-base font-bold font-heading"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current"></div>
                  Creating Account...
                </div>
              ) : (
                "START LOGGING"
              )}
            </Button>
          </div>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Already crushing it?
              </span>
            </div>
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
      <Toaster position="top-center" richColors />
    </>
  );
};
