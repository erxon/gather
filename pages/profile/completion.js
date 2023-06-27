//after completion, redirect user to the 'wait for verification page'
import { useUser } from "@/lib/hooks";
import { Typography, Paper, CircularProgress, Divider } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CompletionForm from "@/components/profile/CompletionForm/CompletionForm";

export default function Page() {
  const router = useRouter();
  const [user, { loading }] = useUser();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/");
    }
  }, [user, loading]);

  if (loading) return <CircularProgress />;

  return (
    <Paper variant="outlined" sx={{p: 3}}>
      <Typography variant="h6">Complete your profile</Typography>
      <Divider sx={{my: 3}} />
      <CompletionForm user={user} />
    </Paper>
  );
}
