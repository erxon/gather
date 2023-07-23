import { fetcher } from "@/lib/hooks";
import useSWR from "swr";
import SearchBar from "./SearchBar";

export default function SearchBarUsers(){
    const {data, error, isLoading} = useSWR("/api/users", fetcher)

    if (isLoading) return <CircularProgress />

    if(data){
        return <SearchBar label="Search users" data={data.users} link={'/profile'} />;
    }
}