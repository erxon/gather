import calculateTimeElapsed from "@/utils/calculateTimeElapsed";
import { ampmTimeFormat } from "@/utils/helpers/ampmTimeFormat";
import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import useSWR from "swr";
import InventoryIcon from "@mui/icons-material/Inventory";
import { fetcher } from "@/lib/hooks";

export default function DateAndTimeReported({ reportedAt }) {
  const date = new Date(reportedAt);
  const time = ampmTimeFormat(date);
  const elapsedTime = calculateTimeElapsed(date);

  return (
    <Paper sx={{ p: 3, mb: 1 }}>
      <Typography variant="body2">Date and time reported</Typography>
      <Typography sx={{ fontWeight: "bold" }}>
        {date.toDateString()} {time}
      </Typography>
      <Typography sx={{ mt: 2 }} variant="body2">
        Time passed since the person went missing
      </Typography>
      <Typography sx={{ fontWeight: "bold" }}> {elapsedTime} </Typography>
      <Button
        size="small"
        startIcon={<InventoryIcon />}
        sx={{ mt: 3 }}
        variant="outlined"
      >
        Archive this report
      </Button>
    </Paper>
  );
}
