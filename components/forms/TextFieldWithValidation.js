import { TextField } from "@mui/material";

export default function TextFieldWithValidation({
  label,
  name,
  value,
  changeHandler,
  isSubmitted,
  isFullWidth,
  isMultiline,
  rows,
  style,
}) {
  const isError = value === "" && isSubmitted;
  return (
    <TextField
      fullWidth={isFullWidth}
      error={isError}
      helperText={isError && "This field is required."}
      label={label}
      name={name}
      value={value}
      rows={rows}
      onChange={changeHandler}
      multiline={isMultiline}
      sx={style}
    />
  );
}
