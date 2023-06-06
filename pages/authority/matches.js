import { useUser } from "@/lib/hooks";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

function RenderMatches() {
  return (
    <Box>
      <Typography>Matches will be displayed here</Typography>
    </Box>
  );
}

export default function Matches() {
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <CircularProgress />;
  if (user && user.type !== "authority") {
    return <Typography>Forbidden</Typography>;
  }
  if (user) return <RenderMatches />
}
