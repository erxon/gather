import { fetcher } from "@/lib/hooks";
import SearchBar from "./SearchBar";
import useSWR from "swr";
import { CircularProgress } from "@mui/material";

export default function SearchBarReports() {
  const { data, error, isLoading } = useSWR("/api/reports", fetcher);

  if (isLoading) return <CircularProgress />;
  return <SearchBar label="Search report" data={data} />;
}
