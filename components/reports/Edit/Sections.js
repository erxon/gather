import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

function Menu({ setCurrentSection }) {
  return (
    <div>
      <List>
        {[
          "Photo",
          "Basic information",
          "Contact information",
          "Details",
          "Dental and Fingerprint Records",
          "Location",
          "Reference Photos",
        ].map((text, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => {
                setCurrentSection(text);
              }}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

function MenuMobile({ setOpen, setCurrentSection }) {
  return (
    <div>
      <List>
        {[
          "Photo",
          "Basic information",
          "Contact information",
          "Details",
          "Dental and Fingerprint Records",
          "Location",
          "Reference Photos",
        ].map((text, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => {
                setCurrentSection(text);
                setOpen(false);
              }}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default function Sections({ currentSection, setCurrentSection }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Menu setCurrentSection={setCurrentSection} />
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
          <Typography>{currentSection}</Typography>
        </Stack>
        <Collapse in={open}>
          <MenuMobile setOpen={setOpen} setCurrentSection={setCurrentSection} />
        </Collapse>
      </Box>
    </div>
  );
}
