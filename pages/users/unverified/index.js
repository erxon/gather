import { Box } from "@mui/material";
import UnverifiedUsers from "@/components/users/UnverifiedUsers";
import Head from "@/components/Head";
import UserStatus from "@/components/authorization/UserStatus";
import ContentLayout from "@/utils/layout/ContentLayout";

export default function Page() {
  return (
    <ContentLayout>
      <UserStatus>
        <Box>
          <Head title="Unverified users" />
          <UnverifiedUsers />
        </Box>
      </UserStatus>
    </ContentLayout>
  );
}
