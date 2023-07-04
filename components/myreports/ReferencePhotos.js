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
} from "@mui/material";
import { useState } from "react";
import UploadReferencePhotos from "./UploadReferencePhotos";
import DisplayReferencePhotos from "./DisplayReferencePhotos";

export default function ReferencePhotos({ reportId, mpName }) {
  const [open, setOpen] = useState(false);
  const [uploadDisable, setUploadDisable] = useState(false);
  const { data, error, isLoading, mutate } = useSWR(
    `/api/photos/report/${reportId}`,
    fetcher
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleUploadClose = () => {
    setOpen(false);
    setUploadDisable(true);
  };

  if (error) return <Typography>Something went wrong.</Typography>;
  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Reference Images</DialogTitle>
        <UploadReferencePhotos
          reportId={reportId}
          mpName={mpName}
          handleClose={handleUploadClose}
        />
      </Dialog>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Reference Photos</Typography>
        <Typography variant="body1" sx={{ mb: 2 }} fontWeight={500}>
          This photos will be used as references for face recognition system.
        </Typography>
        {data ? (
          <DisplayReferencePhotos images={data.images} />
        ) : (
          <div>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Button
                disabled={uploadDisable}
                onClick={() => setOpen(true)}
                variant="contained"
              >
                Upload Reference Photos
              </Button>
              {uploadDisable && <CircularProgress />}
            </Stack>
          </div>
        )}
      </Paper>
    </div>
  );
}
