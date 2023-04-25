import { fetcher, useUser } from "@/lib/hooks";
import useSWR from 'swr';
import { Box, CircularProgress } from "@mui/material";

export default function Communicate(){
    const [user, {loading}] = useUser();

    if(user){
        console.log(user)
    }

    return <>
        <Box>Communicate here</Box>
    </>
}