//after completion, redirect user to the 'wait for verification page'
import { useUser } from "@/lib/hooks";
import { Typography, Paper, CircularProgress, Divider } from "@mui/material";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import CompletionForm from "@/components/profile/CompletionForm/CompletionForm";

export default function Page() {
  const router = useRouter();
  const [user, { loading, mutate }] = useUser();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  if (user) {
    return (
      <div>
        {user.status === "unverified" ? (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6">Complete your profile</Typography>
            <Typography variant="body1">
              Please wait while we verify your profile. Fill all the necessary
              details.
            </Typography>
            <Divider sx={{ my: 3 }} />
            <CompletionForm user={user} mutate={mutate} />
          </Paper>
        ) : (
          router.push("/dashboard")
        )}
      </div>
    );
  }
}
