import { useRouter } from "next/router";
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import SearchIcon from "@mui/icons-material/Search";
import QueryPhotoLarge from "@/components/photo/QueryPhotoLarge";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import { useState } from "react";
import ReportPhoto from "@/components/photo/ReportPhoto";
import ReportPhotoSmall from "@/components/photo/ReportPhotoSmall";
import StackRowLayout from "@/utils/StackRowLayout";
import Link from "next/link";

import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function DisplayDialog({ open, reportId, title, setOpen }) {
  const router = useRouter();

  return (
    <Dialog open={open} setOpen={setOpen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          If this matches your report, click Match.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => router.push(`/reports/${reportId}`)}>
          View
        </Button>
        <Button onClick={() => router.push(`/reports/upload/${photoId}`)}>
          Match
        </Button>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

function SearchResult({ reportId, score, setOpen }) {
  const { data, isLoading, error } = useSWR(
    `/api/reports/${reportId}`,
    fetcher
  );

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;

  if (data) {
    const date = new Date(data.reportedAt);
    const elapsedTime = computeElapsedTime(date);
    return (
      <CardActionArea
        onClick={() => {
          setOpen({
            open: true,
            title: `${data.firstName} ${data.middleName} ${data.lastName}`,
            reportId: reportId,
          });
        }}
      >
        <Card sx={{ display: "flex", alignItems: "flex-start", height: 100 }}>
          <CardMedia>
            <ReportPhotoSmall publicId={data.photo} />
          </CardMedia>
          <CardContent>
            <Typography> Match score: {Math.round(score)}%</Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {" "}
              {data.firstName} {data.middleName} {data.lastName}
            </Typography>
            <StackRowLayout spacing={1}>
              <Typography variant="body2">Reported {elapsedTime}</Typography>
              <Chip size="small" label={data.status} />
            </StackRowLayout>
          </CardContent>
        </Card>
      </CardActionArea>
    );
  }
}

export default function Page() {
  const router = useRouter();
  const { photoId } = router.query;
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState("");
  const [openMatchFoundDialog, setOpenMatchFoundDialog] = useState({
    open: false,
    title: "",
    reportId: null,
  });
  const { data, isLoading, error } = useSWR(`/api/photos/${photoId}`, fetcher);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;

  //Search photo in database

  const handleFindMatch = async () => {
    setSearching("searching");
    const pastMatches = await fetch(
      `/api/face-recognition/past-matches/${data.image}`
    );
    const pastMatchesResult = await pastMatches.json();

    if (pastMatchesResult) {
      setResults(pastMatchesResult);
      setSearching("done");
      return;
    }

    const getMatches = await fetch(`/api/imagga-face-recognition/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryPhoto: data.image }),
    });

    const result = await getMatches.json();
    setResults(result);
    setSearching("done");
  };

  const date = new Date(data.createdAt);
  const timeElapsed = computeElapsedTime(date);

  //If found, notify the authorities about the possible match
  //If not found, proceed to /reports/upload/[photoId]

  return (
    <div>
      <DisplayDialog
        open={openMatchFoundDialog.open}
        setOpen={setOpenMatchFoundDialog}
        title={openMatchFoundDialog.title}
        reportId={openMatchFoundDialog.reportId}
        photoId={photoId}
      />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Paper sx={{ p: 3 }}>
          <Box sx={{ width: 500, textAlign: "center" }}>
            <QueryPhotoLarge publicId={data.image} />
            <Typography sx={{ mt: 1 }} color="GrayText">
              Uploaded {timeElapsed}
            </Typography>
            <Button
              onClick={handleFindMatch}
              sx={{ mt: 2, mb: 1 }}
              variant="contained"
              startIcon={<SearchIcon />}
            >
              Search
            </Button>

            {searching === "done" && !results && (
              <Typography variant="body2" color="GrayText">
                No match found
              </Typography>
            )}
          </Box>
          <Box>
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography sx={{ mb: 1 }} variant="h6">
                Results
              </Typography>
              <Typography sx={{ mb: 0.5 }}>No match found?</Typography>
              <Button
                endIcon={<ArrowCircleRightIcon />}
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
                onClick={() => router.push(`/reports/upload/${photoId}`)}
              >
                Proceed
              </Button>
              <Button
                endIcon={<AccountCircleIcon />}
                variant="outlined"
                size="small"
                onClick={() => router.push("/signup/citizen")}
              >
                Profile this report
              </Button>
            </Box>
            {searching === "searching" && (
              <Box sx={{ mb: 2 }}>
                <StackRowLayout spacing={1}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="GrayText">
                    Searching
                  </Typography>
                </StackRowLayout>
              </Box>
            )}
            {results &&
              results.result.map((result) => {
                if (result.id === "undefined") return;
                return (
                  <SearchResult
                    key={result.id}
                    reportId={result.id}
                    score={result.score}
                    setOpen={setOpenMatchFoundDialog}
                  />
                );
              })}
          </Box>
        </Paper>
      </Box>
    </div>
  );
}
