import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import {
  Paper,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  Stack,
  Box,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { useState } from "react";
import UploadReferencePhotos from "./UploadReferencePhotos";
import DisplayReferencePhotos from "./DisplayReferencePhotos";

export default function ReferencePhotos({ reportId, mpName }) {
  const [open, setOpen] = useState(false);
  const [uploading, setIsLoading] = useState(false);
  const { data, error, isLoading, mutate } = useSWR(
    `/api/photos/report/${reportId}`,
    fetcher
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleUploadClose = () => {
    setOpen(false);
  };

  if (error) return <Typography>Something went wrong.</Typography>;
  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Reference Images</DialogTitle>
        <DialogContent>
          <UploadReferencePhotos
            reportId={reportId}
            mpName={mpName}
            handleClose={handleUploadClose}
            setIsLoading={setIsLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ p: 3 }}>
        <DisplayReferencePhotos images={data.images} />
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {!uploading && <Button size="small" onClick={() => setOpen(true)}>
            Add photos
          </Button>}
          {uploading && <CircularProgress size={24} />}
        </Stack>
      </Paper>
    </div>
  );
}
