import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { Mail, EyeOff, Eye, Lock } from "lucide-react";
import React, { useState } from "react";
import { LoginFormData, loginSchema } from "@/schemas/login-schema";
import { FormInputField } from "@/components/Form/FormInputField";
import { useRouter } from "next/navigation";
import { postLogin } from "@/hooks/api/postLogin";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

export const LoginCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<LoginFormData>({
    resolver: standardSchemaResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleRouteTo = (page: string) => {
    router.push(page);
  };

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;
    setIsLoading(true);
    try {
      const res = await postLogin({ email, password });
      if (res.ok) {
        const { message } = await res.json();
        alert(message);
      } else {
        const { errors } = await res.json();
        errors.map((error: string) => alert(error));
      }
    } catch (error) {
      console.log("Could not fetch login", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-12 h-12"
                autoComplete="current-password"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full h-12 text-base font-semibold"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current"></div>
                Logging In...
              </div>
            ) : (
              "LOG IN"
            )}
          </Button>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              New to aevim?
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-12 text-base mt-4"
          onClick={() => handleRouteTo("/signup")}
        >
          CREATE ACCOUNT
        </Button>
      </CardContent>
    </Card>
  );
};
