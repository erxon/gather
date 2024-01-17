import {
  TextField,
  InputAdornment,
  Collapse,
  Paper,
  Typography,
  IconButton,
  Button,
  Avatar,
  Card,
  CardContent,
  Box,
  InputBase,
  CardActionArea,
  CardMedia,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ProfilePhoto from "../photo/ProfilePhoto";
import { useRouter } from "next/router";
import ClearIcon from "@mui/icons-material/Clear";
import Image from "next/image";

function stringToColor(string) {
  let hash = 0;
  let i;

  let color = "#";

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function ResultCard({ id, name, photo, link }) {
  const router = useRouter();
  return (
    <CardActionArea
      onClick={() => {
        router.push(`${link}/${id}`);
      }}
    >
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          mb: 1,
        }}
      >
        <CardMedia>
          {photo ? (
            <ProfilePhoto publicId={photo} />
          ) : (
            <Image
              alt="placeholder image"
              src="/assets/placeholder.png"
              style={{ borderRadius: "100%" }}
              width={56}
              height={56}
            />
          )}
        </CardMedia>
        <Typography variant="body2" sx={{ fontWeight: "bold", ml: 1 }}>
          {name}
        </Typography>
      </Card>
    </CardActionArea>
  );
}

export default function SearchBar(props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [result, setResult] = useState(props.data);

  const handleChange = (event) => {
    setValue(event.target.value);
    setResult(
      props.data.filter((report) => {
        const name = `${report.firstName} ${report.lastName}`;
        return name.toLowerCase().includes(value.toLowerCase());
      })
    );
    if (event.target.value.length > 0) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Paper
        sx={{ p: 2, display: "flex", alignItems: "center", maxWidth: 400 }}
      >
        <InputBase
          variant="outlined"
          size="small"
          placeholder={props.label}
          name={props.name}
          value={value}
          onChange={handleChange}
          sx={{ width: "100%" }}
        />
        <IconButton onClick={() => setValue("")} color="secondary">
          <ClearIcon />
        </IconButton>
      </Paper>
      <Collapse sx={{ position: "absolute", zIndex: 2 }} in={open}>
        <Paper sx={{ maxWidth: 500, p: 1 }}>
          {result &&
            result.map((data, index) => {
              if (index < 3) {
                return (
                  <ResultCard
                    key={data._id}
                    link={props.link}
                    photo={data.photo}
                    id={data._id}
                    name={`${data.firstName} ${data.lastName}`}
                  />
                );
              }
            })}
          <Button
            onClick={handleClose}
            size="small"
            startIcon={<CloseIcon />}
            variant="outlined"
          >
            Cancel
          </Button>
        </Paper>
      </Collapse>
    </Box>
  );
}
