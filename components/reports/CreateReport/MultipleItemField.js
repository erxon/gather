import { useState } from "react";
import {
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function MultipleItemField({
  collection,
  collectionName,
  collections,
  setCollections,
  label,
}) {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleAdd = () => {
    if (value === "") return;
    setCollections({
      ...collections,
      [collectionName]: [...collection, value],
    });
    setValue("");
  };

  const handleDelete = (indexToDelete) => {
    setCollections({
      ...collections,
      [collectionName]: [
        ...collection.filter((item, index) => {
          if (indexToDelete !== index) return item;
        }),
      ],
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        size="small"
        variant="standard"
        label={label}
        value={value}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleAdd}>
                <AddIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box>
        {collection.map((item, index) => {
          return (
            <Chip
              sx={{ mr: 1, mb: 1 }}
              key={index}
              label={item}
              onDelete={() => handleDelete(index)}
            />
          );
        })}
      </Box>
    </Paper>
  );
}
