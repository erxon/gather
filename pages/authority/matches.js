import { useUser } from "@/lib/hooks";
import { CircularProgress, Box } from "@mui/material";
import { useRouter } from "next/router";

export default function Matches() {
  const [user, { loading }] = useUser();
  const router = useRouter();

  useEffect(() => {
    if(!loading && !user){
        router.push("/login")
    }

  }, [user, loading])

  if (loading) return <CircularProgress />;
  
  return (
    <>
      <Box>Display possible matches here</Box>
    </>
  );
}
