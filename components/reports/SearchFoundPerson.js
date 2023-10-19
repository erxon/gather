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

function DisplayDialog({
  open,
  photo,
  reportId,
  reportedAt,
  matchScore,
  status,
  title,
  setOpen,
  setPossibleMatch,
}) {
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
        <Button
          onClick={() => {
            setPossibleMatch({
              _id: reportId,
              photo: photo,
              name: title,
              status: status,
              reportedAt: reportedAt,
              score: matchScore,
            });

            setOpen({ open: false });
          }}
        >
          Match
        </Button>
        <Button onClick={() => setOpen({ open: false })}>Cancel</Button>
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
            reportedAt: elapsedTime,
            matchScore: score,
            photo: data.photo,
            status: data.status,
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

export default function SearchFoundPerson({ setPossibleMatch }) {
  const router = useRouter();
  const { photoId } = router.query;
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState("");
  const [openMatchFoundDialog, setOpenMatchFoundDialog] = useState({
    open: false,
    title: "",
    matchScore: null,
    reportId: null,
    reportedAt: "",
    status: "",
    photo: null,
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
        photoId={photoId}
        setOpen={setOpenMatchFoundDialog}
        open={openMatchFoundDialog.open}
        title={openMatchFoundDialog.title}
        reportId={openMatchFoundDialog.reportId}
        photo={openMatchFoundDialog.photo}
        reportedAt={openMatchFoundDialog.reportedAt}
        matchScore={openMatchFoundDialog.matchScore}
        status={openMatchFoundDialog.status}
        setPossibleMatch={setPossibleMatch}
      />
      <Box>
        <Box sx={{ mb: 2 }}>
          <Button
            endIcon={<AccountCircleIcon />}
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => router.push("/signup/citizen")}
          >
            Profile this report
          </Button>
          <Button
            variant="outlined"
            onClick={handleFindMatch}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Box>
        {searching === "done" && !results && (
          <Typography variant="body2" color="GrayText">
            No match found
          </Typography>
        )}
        <Box>
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
            results.result &&
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
      </Box>
    </div>
  );
}
