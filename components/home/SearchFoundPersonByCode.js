import { Box, IconButton, InputBase, Paper, Stack, Typography } from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import ErrorAlert from "../ErrorAlert";
import useSWR from "swr";
import { useRouter } from "next/router";

export default function SearchFoundPersonReportByCode() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState({
    open: false,
    message: "",
  });

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = async () => {
    const code = "found-"+searchValue
    const response = await fetch(
      `/api/reporters/found-person-code/${code}`
    );
    const url = process.env.API_URL || "http://localhost:3000";
    const result = await response.json();

    if (result.found === false) {
      setError({ open: true, message: result.message });
      return;
    }
    
    return router.push(`${url}/found-person/${result.photoUploaded}`)
  };

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Paper sx={{ p: 3 }}>
        <Typography sx={{fontWeight: "bold", mb: 1}}>Found person report</Typography>
        <Stack sx={{mb: 1}} direction="row" alignItems="center" spacing={1}>
          <Typography>found-</Typography>
          <InputBase
            onChange={handleChange}
            sx={{p: 1, borderRadius: "5px", width: "100%", bgcolor: "#f0f0f0" }}
            placeholder="Enter code"
          />
          <IconButton>
            <ClearOutlinedIcon />
          </IconButton>
          <IconButton onClick={handleSearch}>
            <ArrowForwardIcon color="primary" />
          </IconButton>
        </Stack>

        <ErrorAlert
          open={error.open}
          message={error.message}
          close={() => setError({ open: false })}
        />
      </Paper>
    </Box>
  );
}
