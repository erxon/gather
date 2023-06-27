import { Box } from "@mui/material"
import UnverifiedUsers from "@/components/users/UnverifiedUsers"
import Head from "@/components/Head"

export default function Page(){

    return <Box>
        <Head title="Unverified users" />
        <UnverifiedUsers />
    </Box>
}