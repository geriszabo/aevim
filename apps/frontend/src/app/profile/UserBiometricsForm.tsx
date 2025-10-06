"use client";

import { Controller, useForm } from "react-hook-form";
import { FormInputField } from "@/components/Form/FormInputField";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserBiometrics, userBiometricsSchema } from "@aevim/shared-types";
import React, { useMemo } from "react";
import { GetUserBiometricsResponse } from "@/types/api";

interface UserBiometricsFormProps {
  formId: string;
  onCreate: (data: UserBiometrics) => void;
  onUpdate: (data: UserBiometrics) => void;
  biometrics: GetUserBiometricsResponse["biometrics"];
}

export const UserBiometricsForm = ({
  formId,
  onCreate,
  onUpdate,
  biometrics,
}: UserBiometricsFormProps) => {
  const defaultValues = useMemo(() => {
    return {
      build: (biometrics?.build ?? "") as UserBiometrics["build"],
      height: (biometrics?.height ?? "") as unknown as UserBiometrics["height"],
      sex: (biometrics?.sex ?? "") as UserBiometrics["sex"],
      weight: (biometrics?.weight ?? "") as unknown as UserBiometrics["weight"],
    };
  }, [biometrics]);

  const hasExistingData = !!biometrics;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserBiometrics>({
    defaultValues,
  });

  const onSubmit = (data: UserBiometrics) => {
    if (hasExistingData) {
      onUpdate({ ...data });
    } else {
      onCreate({ ...data });
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <FormInputField
          id="height"
          label="Height"
          register={register}
          type="number"
          error={errors.height}
          {...register("height", { valueAsNumber: true })}
        />
        <FormInputField
          id="weight"
          label="Weight"
          register={register}
          type="number"
          error={errors.weight}
          {...register("weight", { valueAsNumber: true })}
        />
        <Controller
          control={control}
          name="build"
          render={({ field }) => (
            <div className="space-y-2">
              <Label className="text-sm font-medium">{"Body build"}</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full bg-background !h-12 ">
                  <SelectValue placeholder="Select your body build" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Build type</SelectLabel>
                    {userBiometricsSchema.shape.build.options.map((build) => (
                      <SelectItem value={build} key={build}>
                        {build}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <Controller
          control={control}
          name="sex"
          render={({ field }) => (
            <div className="space-y-2">
              <Label className="text-sm font-medium">{"Sex"}</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full bg-background !h-12">
                  <SelectValue placeholder="Select your sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sex</SelectLabel>
                    {userBiometricsSchema.shape.sex.options.map((sex) => (
                      <SelectItem value={sex} key={sex}>
                        {sex}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
    </form>
  );
};
