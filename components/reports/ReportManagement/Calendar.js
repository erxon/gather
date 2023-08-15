import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Paper } from "@mui/material";

export default function Calendar() {
  return (
    <Paper>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar />
      </LocalizationProvider>
    </Paper>
  );
}
