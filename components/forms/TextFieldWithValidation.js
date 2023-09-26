import { TextField } from "@mui/material";

export default function TextFieldWithValidation({
  type,
  label,
  name,
  value,
  changeHandler,
  isSubmitted,
  isFullWidth,
  isMultiline,
  rows,
  style,
  inputProps,
  size
}) {
  const isError = value === "" && isSubmitted;
  return (
    <TextField
      fullWidth={isFullWidth}
      size={size}
      error={isError}
      helperText={isError && "This field is required."}
      type={type}
      label={label}
      name={name}
      value={value}
      rows={rows}
      onChange={changeHandler}
      multiline={isMultiline}
      sx={style}
      InputProps={inputProps}
    />
  );
}
