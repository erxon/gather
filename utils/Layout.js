import { Box } from "@mui/material";

export default function Layout({children}){
    return <>
        <Box
            sx={{
                marginTop: "50px",
                padding: "30px",
                borderRadius: "20px",
            }}
        >
            {children}
        </Box>
    </>
}