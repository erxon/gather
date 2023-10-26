import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function GenderSelection({isSubmitted, gender, handleChange }) {
  return (
    <FormControl fullWidth>
      <InputLabel id="select-gender-label">{"Gender (Required)"}</InputLabel>
      <Select
        error={isSubmitted && gender === ""}
        labelId="select-gender-label"
        id="select-gender"
        value={gender}
        label="Gender (Required)"
        name="gender"
        onChange={handleChange}
      >
        <MenuItem value={"Male"}>Male</MenuItem>
        <MenuItem value={"Female"}>Female</MenuItem>
      </Select>
    </FormControl>
  );
}
