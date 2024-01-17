import { useRouter } from "next/router";
import Signup from "@/components/authentication/Signup";
import ContentLayout from "@/utils/layout/ContentLayout";
import { Box } from "@mui/material";

export default function Page() {
  const router = useRouter();
  const { type } = router.query;

  return (
    <ContentLayout>
      <Box sx={{width: '500px', m: "auto"}}>
        <Signup type={type} />
      </Box>
    </ContentLayout>
  );
}
