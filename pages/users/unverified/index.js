import { Box } from "@mui/material";
import UnverifiedUsers from "@/components/users/UnverifiedUsers";
import Head from "@/components/Head";
import UserStatus from "@/components/authorization/UserStatus";

export default function Page() {
  return (
    <UserStatus>
      <Box>
        <Head title="Unverified users" />
        <UnverifiedUsers />
      </Box>
    </UserStatus>
  );
}
