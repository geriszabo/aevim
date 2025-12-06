"use client";

import { Typography } from "@/components/ui/typography";
import { useAuth } from "@/contexts/AuthContext";

const DashboardHeaderSection = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Typography variant="heading" size="3xl">
        Fetching your data...
      </Typography>
    );
  }
  return (
    <>
      <Typography variant="heading" size="3xl" className="mb-2">
        {`Ready to Log ${user?.username}?`}
      </Typography>
      <Typography variant="muted">Time to crush your next session</Typography>
    </>
  );
};

export default DashboardHeaderSection;
