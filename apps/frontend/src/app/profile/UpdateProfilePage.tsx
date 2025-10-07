"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Typography } from "@/components/ui/typography";
import { UserBiometricsForm } from "./UserBiometricsForm";
import { useCreateUserBiometrics } from "@/hooks/userBiometrics/useCreateUserBiometrics";
import { useUpdateUserBiometrics } from "@/hooks/userBiometrics/useUpdateUserBiometrics";
import { GetUserBiometricsResponse } from "@/types/api";
import { UserBiometrics } from "@aevim/shared-types";

interface UpdateProfilePageProps {
  biometrics: GetUserBiometricsResponse["biometrics"];
}

export const UpdateProfilePage = ({ biometrics }: UpdateProfilePageProps) => {
  const router = useRouter();

  const { mutate: createUserBiometrics, isPending: isPendingCreate } =
    useCreateUserBiometrics();
  const { mutate: updateUserBiometrics, isPending: isPendingUpdate } =
    useUpdateUserBiometrics();

  const handleCreate = (data: UserBiometrics) => {
    createUserBiometrics(data, {
      onSuccess: () => router.refresh(),
    });
  };

  const handleUpdate = (data: UserBiometrics) => {
    updateUserBiometrics(data, {
      onSuccess: () => router.refresh(),
    });
  };

  const isLoading = isPendingCreate || isPendingUpdate;

  return (
    <Drawer>
      <DrawerTrigger className="w-full" asChild>
        <Button className="w-full p-6">
          <Typography size="xl" variant="heading">
            Update profile
          </Typography>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Update biometrics</DrawerTitle>
          <UserBiometricsForm
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            formId="biometrics-form"
            biometrics={biometrics}
          />
        </DrawerHeader>
        <DrawerFooter>
          <Button type="submit" form="biometrics-form" disabled={isLoading}>
            <Typography variant="heading" size="md">
              {isLoading ? "Loading..." : "Submit"}
            </Typography>
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
