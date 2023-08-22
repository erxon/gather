import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Paper } from "@mui/material";
import { useState } from "react";

export default function Calendar({setExternalDate}) {
  const [value, setValue] = useState(dayjs());

  const handleChange = (newValue) => {
    setValue(newValue);
    setExternalDate(newValue.$d)
  };

  return (
    <Paper>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar value={value} onChange={handleChange} />
      </LocalizationProvider>
    </Paper>
  );
}
