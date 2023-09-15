import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import StackRowLayout from "@/utils/StackRowLayout";
import QueryPhoto from "../photo/QueryPhoto";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import { useState } from "react";
import { useRouter } from "next/router";

function DisplayPhoto({ photo }) {
  const { data, error, isLoading } = useSWR(`/api/photos/${photo}`, fetcher);

  if (error) return <Typography>Error.</Typography>;
  if (isLoading) return <CircularProgress />;

  if (data) {
    return <QueryPhoto publicId={data.image} />;
  }
}

export default function ModalFoundMissingPerson({ photo, open, setOpen, id }) {
  const { data, isLoading, error } = useSWR(
    `/api/reporters/uploaded-photo/${photo}`,
    fetcher
  );
  const [position, setPosition] = useState();
  const router = useRouter();

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      {" "}
      <DialogTitle>Found Missing Person</DialogTitle>
      <DialogContent>
        <Box sx={{ borderRadius: "15px", width: 100, height: 100 }}>
          <DisplayPhoto photo={photo} />
        </Box>
        {/*Operations*/}
        <Box>
          <DialogContentText sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>What to do?</Typography>
            <StackRowLayout spacing={0.5}>
              <RouteIcon />
              <Typography variant="body2">
                <span style={{ fontWeight: "bold" }}>View route</span> - view
                route from your location to the missing person's location
              </Typography>
            </StackRowLayout>
            <StackRowLayout spacing={0.5}>
              <PersonSearchIcon />
              <Typography variant="body2">
                <span style={{ fontWeight: "bold" }}>Search face</span> - search
                database if there is an existing report about this person
              </Typography>
            </StackRowLayout>
          </DialogContentText>

          <Button
            onClick={() => router.push(`/reporter/map-route/${photo}`)}
            sx={{ mr: 1 }}
            variant="outlined"
            startIcon={<RouteIcon />}
          >
            View route
          </Button>
          <Button variant="outlined" startIcon={<PersonSearchIcon />}>
            Search face
          </Button>
        </Box>
        <div className="map"></div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
